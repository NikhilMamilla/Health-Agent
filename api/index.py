from flask import Flask, request, jsonify
from flask_cors import CORS
from services.analysis_service import AnalysisService
from services.sos_service import SOSService
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize services
try:
    analysis_service = AnalysisService()
    logger.info("✅ Analysis service initialized")
except Exception as e:
    logger.error(f"❌ Failed to initialize Analysis service: {e}")
    analysis_service = None

try:
    sos_service = SOSService()
    logger.info("✅ SOS service initialized")
except Exception as e:
    logger.error(f"❌ Failed to initialize SOS service: {e}")
    sos_service = None

@app.route('/api/analyze', methods=['POST'])
def analyze():
    if not analysis_service:
        return jsonify({"error": "Analysis service failed to initialize. Check logs."}), 500
    
    try:
        data = request.get_json()
        message = data.get('message', '')
        mode = data.get('mode', 'user')
        history = data.get('history', [])
        emergency_contacts = data.get('emergency_contacts', [])
        
        result = analysis_service.perform_full_analysis(message, mode, history, emergency_contacts)
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/sos/trigger', methods=['POST'])
def trigger_sos():
    if not sos_service:
        logger.error("SOS service not initialized")
        return jsonify({"error": "SOS service failed to initialize. Check logs."}), 500
    
    """
    Manual SOS trigger endpoint with enhanced data.
    Expected body:
    {
        "emergency_contacts": [{"name": "", "phone": ""}, ...],
        "user_location": {"lat": float, "lng": float} or {"address": ""},
        "user_info": {"name": "", "uid": ""}
    }
    """
    try:
        # Log the incoming request
        logger.info("Received SOS trigger request")
        
        # Handle case where request body might be empty or malformed
        try:
            data = request.get_json(force=True) or {}
        except Exception as parse_error:
            logger.error(f"Failed to parse JSON: {parse_error}")
            return jsonify({"error": "Invalid JSON in request body"}), 400
            
        emergency_contacts = data.get('emergency_contacts', [])
        user_location = data.get('user_location')  # Optional
        user_info = data.get('user_info')          # Optional
        
        logger.info(f"Processing SOS with {len(emergency_contacts)} contacts")
        
        result = sos_service.trigger_sos(emergency_contacts, user_location, user_info)
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"SOS trigger error: {e}", exc_info=True)
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    services_status = {
        "analysis_service": analysis_service is not None,
        "sos_service": sos_service is not None,
        "twilio_configured": sos_service.client is not None if sos_service else False
    }
    return jsonify({
        "status": "healthy",
        "services": services_status
    }), 200

if __name__ == '__main__':
    # Using 0.0.0.0 to make it accessible outside container if needed
    app.run(host='0.0.0.0', port=5000, debug=True)
