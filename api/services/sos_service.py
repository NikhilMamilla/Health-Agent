import logging
import os
import json
from datetime import datetime
from twilio.rest import Client
from utils.constants import MOCK_EMERGENCY_CONTACTS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SOSService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.from_number = os.getenv("TWILIO_PHONE_NUMBER")
        
        self.client = None
        if self.account_sid and self.auth_token:
            try:
                self.client = Client(self.account_sid, self.auth_token)
                logger.info("✅ Twilio client initialized successfully")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Twilio Client: {e}")
        else:
            logger.warning("⚠️  Twilio credentials not found. Running in mock mode.")

    def _is_valid_phone(self, phone):
        """Simple validation to check if a phone number looks valid."""
        if not phone or not isinstance(phone, (str, int)):
            return False
        
        phone_str = str(phone).strip()
        # Basic check: should have at least 10 digits and optionally start with '+'
        # This catches "Emergency Contact 1" and other random strings
        digits_only = ''.join(filter(str.isdigit, phone_str))
        
        # Valid numbers should have 10-15 digits (standard E.164-ish)
        if len(digits_only) < 10:
            return False
            
        return True

    def trigger_sos(self, emergency_contacts=None, user_location=None, user_info=None):
        """
        Triggers SOS alert via Twilio SMS with enhanced information.
        
        Args:
            emergency_contacts: List of contacts [{'name': '', 'phone': ''}]
            user_location: Dict with lat/lng or address
            user_info: Dict with user details (name, uid, etc.)
        """
        logger.info("🚨 SOS TRIGGERED - EMERGENCY PROTOCOL ACTIVATED 🚨")
        
        # Use provided contacts or fallback to mock
        contacts = emergency_contacts if emergency_contacts and isinstance(emergency_contacts, list) else MOCK_EMERGENCY_CONTACTS
        
        if not contacts:
            logger.warning("⚠️ No emergency contacts found. SOS alert could not be sent.")
            return {
                "sos_triggered": False,
                "message": "No emergency contacts found in profile. Please add contacts to enable SOS alerts.",
                "contacts_notified": []
            }

        # Prepare location info
        location_info = ""
        if user_location:
            if 'lat' in user_location and 'lng' in user_location:
                location_info = f"Location: {user_location['lat']}, {user_location['lng']}"
                # Optional: Add Google Maps link
                location_info += f" | Map: https://maps.google.com/?q={user_location['lat']},{user_location['lng']}"
            elif 'address' in user_location:
                location_info = f"Address: {user_location['address']}"
        
        # Prepare user info
        user_name = 'User'
        user_uid = 'Unknown'
        if user_info and isinstance(user_info, dict):
            user_name = user_info.get('name', 'User')
            user_uid = user_info.get('uid', 'Unknown')
        
        results = []
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        if self.client and self.from_number:
            logger.info(f"📱 Sending real SMS alerts to {len(contacts)} contacts...")
            
            for contact in contacts:
                try:
                    name = 'Contact'
                    phone = None
                    
                    if isinstance(contact, dict):
                        name = contact.get('name', 'Contact')
                        phone = contact.get('phone')
                    else:
                        # Handle case where contact might be a string
                        name = str(contact)
                        phone = str(contact)
                    
                    if not self._is_valid_phone(phone):
                        logger.warning(f"⏩ Skipping invalid phone number for {name}: {phone}")
                        results.append({
                            "name": name,
                            "phone": str(phone),
                            "status": "skipped",
                            "error": "Invalid phone number format",
                            "timestamp": timestamp
                        })
                        continue

                    # Simplified message for better delivery in India (Carrier filters are strict)
                    message_body = (
                        f"KIDDOO SOS ALERT: {user_name} needs support. "
                        f"Time: {timestamp}. {location_info}. "
                        f"Please check on them."
                    )
                    
                    message = self.client.messages.create(
                        body=message_body,
                        from_=self.from_number,
                        to=str(phone)
                    )
                    
                    logger.info(f"✅ SMS sent to {name} ({phone}): {message.sid}")
                    results.append({
                        "name": name, 
                        "phone": str(phone),
                        "status": "sent", 
                        "sid": message.sid,
                        "timestamp": timestamp
                    })
                        
                except Exception as e:
                    logger.error(f"❌ Failed to send SMS to {contact}: {e}")
                    name = str(contact) if not isinstance(contact, dict) else contact.get('name', 'Unknown')
                    phone = str(contact) if not isinstance(contact, dict) else contact.get('phone', 'Unknown')
                    results.append({
                        "name": name,
                        "phone": phone,
                        "status": "failed", 
                        "error": str(e),
                        "timestamp": timestamp
                    })
        else:
            logger.warning("⚠️  Twilio not configured properly. Using Mock Logic.")
            results = []
            for c in contacts:
                if isinstance(c, dict):
                    name = c.get('name', 'Mock Contact')
                    phone = c.get('phone', 'Unknown')
                else:
                    name = str(c)
                    phone = str(c)
                results.append({
                    "name": name,
                    "phone": phone,
                    "status": "mock_sent",
                    "timestamp": timestamp
                })

        # Final check if anything was actually sent
        any_notified = any(r['status'] in ['sent', 'mock_sent'] for r in results)

        return {
            "sos_triggered": any_notified,
            "contacts_notified": results,
            "message": "Emergency response sequence initiated" if any_notified else "Emergency alert failed or skipped due to invalid contacts",
            "timestamp": timestamp,
            "user_location": user_location,
            "user_info": user_info
        }

    def no_action(self):
        return {
            "sos_triggered": False,
            "message": "No emergency action required"
        }
