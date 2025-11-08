"""
Flask REST API for Telecom Service Assurance Platform
Main entry point: runs on 127.0.0.1:5000
"""

import sys
from pathlib import Path
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from service.assurance_logic import get_compliance_data

app = Flask(__name__)
CORS(app)


@app.route('/assurance/compliance-status', methods=['GET'])
def compliance_status():
    """
    Core endpoint: Returns comprehensive compliance report
    - Fetches SNMP metrics
    - Runs AI QoS prediction
    - Writes to InfluxDB
    - Returns full JSON report
    """
    print("\n" + "="*60)
    print("Endpoint: /assurance/compliance-status")
    print(f"Time: {datetime.utcnow().isoformat()}")
    print("="*60)
    
    try:
        report = get_compliance_data()
        return jsonify(report), 200
    except Exception as e:
        print(f"[Error] Endpoint exception: {e}")
        error_report = {
            "timestamp": datetime.utcnow().isoformat(),
            "status": "error",
            "error_message": str(e),
            "sla_compliance": {
                "status": "UNKNOWN",
                "threshold": 85.0,
                "qos_score": 0
            }
        }
        return jsonify(error_report), 500


@app.route('/mock-restconf/interface-status', methods=['GET'])
def mock_restconf():
    """
    Mock RESTCONF endpoint: Returns interface status
    Used by assurance_logic.py to simulate RESTCONF device queries
    """
    return jsonify({
        "restconf_status": "UP",
        "timestamp": datetime.utcnow().isoformat(),
        "interface": "eth0",
        "admin_status": "up",
        "oper_status": "up"
    }), 200


@app.route('/health', methods=['GET'])
def health():
    """
    Health check endpoint
    """
    return jsonify({
        "status": "healthy",
        "service": "telecom-assurance-platform",
        "version": "1.0.0"
    }), 200


if __name__ == '__main__':
    print("\n" + "="*60)
    print("Telecom Service Assurance Platform")
    print("Flask API Server Starting")
    print("="*60)
    print("Routes:")
    print("  GET  /health                                - Health check")
    print("  GET  /assurance/compliance-status           - Main compliance report")
    print("  GET  /mock-restconf/interface-status        - Mock RESTCONF endpoint")
    print("\nServer: http://127.0.0.1:5000")
    print("="*60 + "\n")
    
    app.run(host='127.0.0.1', port=5000, debug=False)
