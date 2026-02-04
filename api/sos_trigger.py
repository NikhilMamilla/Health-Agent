import json
import sys
import os
from typing import Dict, Any

# Add the parent api directory to the path to import services
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import the SOS service
from services.sos_service import SOSService
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize SOS service
try:
    sos_service = SOSService()
    logger.info("✅ SOS service initialized")
except Exception as e:
    logger.error(f"❌ Failed to initialize SOS service: {e}")
    sos_service = None

def handler(request):
    """
    Vercel Python function handler for SOS trigger endpoint
    """
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({})
        }

    # Only allow POST method
    if request.method != "POST":
        return {
            "statusCode": 405,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({"error": "Method not allowed"})
        }

    # Check if SOS service is initialized
    if not sos_service:
        logger.error("SOS service not initialized")
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({"error": "SOS service failed to initialize. Check logs."})
        }

    try:
        # Parse request body
        try:
            body = json.loads(request.body.decode('utf-8')) if request.body else {}
        except Exception as parse_error:
            logger.error(f"Failed to parse JSON: {parse_error}")
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
                "body": json.dumps({"error": "Invalid JSON in request body"})
            }

        logger.info("Received SOS trigger request")

        emergency_contacts = body.get('emergency_contacts', [])
        user_location = body.get('user_location')  # Optional
        user_info = body.get('user_info')          # Optional

        logger.info(f"Processing SOS with {len(emergency_contacts)} contacts")

        result = sos_service.trigger_sos(emergency_contacts, user_location, user_info)

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps(result)
        }

    except Exception as e:
        logger.error(f"SOS trigger error: {e}", exc_info=True)
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({"error": f"Internal server error: {str(e)}"})
        }