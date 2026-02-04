"""
Edge Case Test Script for SOS Service
Verify that invalid phone numbers are skipped gracefully.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from services.sos_service import SOSService

def test_sos_edge_cases():
    print("🔧 Testing SOS Service Edge Cases...")
    
    # Initialize service
    sos_service = SOSService()
    
    # Test Data 1: Empty Contacts
    print("\n--- Test 1: Empty Contacts ---")
    result1 = sos_service.trigger_sos(emergency_contacts=[])
    print(f"SOS Triggered: {result1.get('sos_triggered')} (Expected: False)")
    print(f"Message: {result1.get('message')}")

    # Test Data 2: Invalid Phone Strings
    print("\n--- Test 2: Invalid Phone Strings ---")
    invalid_contacts = [
        {"name": "Bad Contact 1", "phone": "Emergency Contact 1"},
        {"name": "Bad Contact 2", "phone": "123"},
        {"name": "Valid-ish Contact", "phone": "12345678901"} # Should be valid digits-wise
    ]
    result2 = sos_service.trigger_sos(emergency_contacts=invalid_contacts)
    print(f"SOS Triggered: {result2.get('sos_triggered')} (Expected: True if at least one is valid-ish)")
    
    print("\n📞 Contact Notifications Analysis:")
    for contact in result2.get('contacts_notified', []):
        status = contact.get('status')
        print(f"  {contact.get('name')} ({contact.get('phone')}) -> Status: {status}")
        if status == "skipped":
            print(f"     ✅ Correctly skipped invalid number")

if __name__ == "__main__":
    try:
        test_sos_edge_cases()
        print("\n🎉 Edge case testing completed!")
    except Exception as e:
        print(f"\n💥 Test failed with error: {e}")
        import traceback
        traceback.print_exc()
