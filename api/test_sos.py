"""
Test Script for SOS Service
Run this to verify Twilio integration works correctly
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from services.sos_service import SOSService

def test_sos_service():
    print("🔧 Testing SOS Service...")
    
    # Initialize service
    sos_service = SOSService()
    
    # Test data
    test_contacts = [
        {"name": "Verified Personal Number", "phone": "+917842070463"}
    ]
    
    test_location = {
        "lat": 40.7128,
        "lng": -74.0060
    }
    
    test_user = {
        "name": "Test User",
        "uid": "test-user-123"
    }
    
    print("\n📝 Test Data:")
    print(f"  Contacts: {len(test_contacts)}")
    print(f"  Location: {test_location}")
    print(f"  User: {test_user}")
    
    # Trigger SOS
    print("\n🚀 Triggering SOS...")
    result = sos_service.trigger_sos(
        emergency_contacts=test_contacts,
        user_location=test_location,
        user_info=test_user
    )
    
    # Display results
    print("\n📊 Results:")
    print(f"  SOS Triggered: {result.get('sos_triggered')}")
    print(f"  Message: {result.get('message')}")
    print(f"  Timestamp: {result.get('timestamp')}")
    
    print("\n📞 Contact Notifications:")
    for contact in result.get('contacts_notified', []):
        status_icon = "✅" if contact.get('status') == 'sent' else "❌" if contact.get('status') == 'failed' else "⏳"
        print(f"  {status_icon} {contact.get('name')} ({contact.get('phone')}) - {contact.get('status')}")
        if 'sid' in contact:
            print(f"      SID: {contact.get('sid')}")
        if 'error' in contact:
            print(f"      Error: {contact.get('error')}")
    
    print("\n📍 Location Data:")
    location = result.get('user_location')
    if location:
        if 'lat' in location:
            print(f"  Latitude: {location['lat']}")
            print(f"  Longitude: {location['lng']}")
        else:
            print(f"  Address: {location.get('address', 'N/A')}")
    
    print("\n👤 User Info:")
    user = result.get('user_info')
    if user:
        print(f"  Name: {user.get('name')}")
        print(f"  UID: {user.get('uid')}")
    
    return result

if __name__ == "__main__":
    try:
        result = test_sos_service()
        if result.get('sos_triggered'):
            print("\n🎉 Test completed successfully!")
        else:
            print("\n⚠️  SOS was not triggered properly")
    except Exception as e:
        print(f"\n💥 Test failed with error: {e}")
        import traceback
        traceback.print_exc()
