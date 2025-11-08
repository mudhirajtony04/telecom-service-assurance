"""
Service Logic Module
Core pipeline: SNMP -> AI Prediction -> InfluxDB -> Report
"""

import sys
from pathlib import Path
import requests
import json
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from collector.snmp_collector import fetch_snmp_metrics, get_interface_stats
from model.qos_predictor import predict_qos
from influxdb import InfluxDBClient


def get_influxdb_client():
    """
    Create and return InfluxDB client
    Assumes local InfluxDB at 127.0.0.1:8086
    """
    client = InfluxDBClient(
        host='127.0.0.1',
        port=8086,
        username='',
        password='',
        database='assurance_metrics',
        timeout=2
    )
    return client


def write_to_influxdb(sla_status, qos_score, latency, packet_loss):
    """
    Write assurance metrics to InfluxDB
    """
    try:
        client = get_influxdb_client()
        
        timestamp = datetime.utcnow().isoformat() + 'Z'
        
        # Prepare data points for InfluxDB
        json_body = [
            {
                "measurement": "assurance_metrics",
                "tags": {
                    "service": "telecom-assurance",
                    "sla_status": sla_status
                },
                "time": timestamp,
                "fields": {
                    "qos_score": float(qos_score),
                    "latency_ms": float(latency),
                    "packet_loss_percent": float(packet_loss),
                    "sla_compliant": 1 if sla_status == 'COMPLIANT' else 0
                }
            }
        ]
        
        # Write to InfluxDB
        client.write_points(json_body, time_precision='u')
        print("[InfluxDB] Data written successfully")
        client.close()
        return True
    
    except Exception as e:
        print(f"[InfluxDB] Error writing data: {e}")
        return False


def get_compliance_data():
    """
    Main compliance pipeline:
    1. Train/Load AI model
    2. Fetch SNMP metrics
    3. Query RESTCONF mock
    4. Run QoS prediction
    5. Write to InfluxDB
    6. Return comprehensive report
    """
    
    print("\n[Assurance] Starting compliance pipeline...")
    
    # Step 1: Load AI model (trained or cached)
    print("[Pipeline] Step 1: Loading QoS prediction model...")
    qos_score = predict_qos(5.0, 0.15)  # Predict with sample metrics first
    print(f"[Pipeline] Model ready, sample QoS: {qos_score}")
    
    # Step 2: Fetch SNMP metrics
    print("[Pipeline] Step 2: Fetching SNMP metrics...")
    snmp_metrics = fetch_snmp_metrics()
    latency_ms = snmp_metrics['latency_ms']
    packet_loss = snmp_metrics['packet_loss_percent']
    print(f"[Pipeline] SNMP - Latency: {latency_ms}ms, Packet Loss: {packet_loss}%")
    
    # Step 2b: Get interface stats
    print("[Pipeline] Step 2b: Fetching interface statistics...")
    interface_stats = get_interface_stats()
    print(f"[Pipeline] Interface - In: {interface_stats['in_octets']} bytes, Out: {interface_stats['out_octets']} bytes")
    
    # Step 3: Query RESTCONF mock endpoint
    print("[Pipeline] Step 3: Querying RESTCONF mock endpoint...")
    try:
        restconf_response = requests.get(
            'http://127.0.0.1:5000/mock-restconf/interface-status',
            timeout=2
        )
        restconf_data = restconf_response.json() if restconf_response.status_code == 200 else {}
        restconf_status = restconf_data.get('restconf_status', 'UNKNOWN')
    except Exception as e:
        print(f"[Pipeline] RESTCONF error: {e}, using fallback")
        restconf_status = 'UNKNOWN'
    
    print(f"[Pipeline] RESTCONF Status: {restconf_status}")
    
    # Step 4: AI QoS Prediction (actual prediction with fetched metrics)
    print("[Pipeline] Step 4: Running AI-based QoS prediction...")
    qos_score = predict_qos(latency_ms, packet_loss)
    print(f"[Pipeline] QoS Score: {qos_score}/100")
    
    # Step 5: Determine SLA Compliance
    sla_threshold = 85.0
    sla_status = 'COMPLIANT' if qos_score >= sla_threshold else 'NON_COMPLIANT'
    print(f"[Pipeline] SLA Status: {sla_status} (threshold: {sla_threshold})")
    
    # Step 5b: Write all data to InfluxDB
    print("[Pipeline] Step 5: Writing metrics to InfluxDB...")
    influx_success = write_to_influxdb(sla_status, qos_score, latency_ms, packet_loss)
    
    # Step 6: Prepare comprehensive JSON report
    report = {
        "timestamp": datetime.utcnow().isoformat(),
        "status": "success",
        "sla_compliance": {
            "status": sla_status,
            "threshold": sla_threshold,
            "qos_score": qos_score
        },
        "network_metrics": {
            "latency_ms": latency_ms,
            "packet_loss_percent": packet_loss,
            "source": snmp_metrics['source']
        },
        "interface_stats": {
            "in_octets": interface_stats['in_octets'],
            "out_octets": interface_stats['out_octets'],
            "source": interface_stats['source']
        },
        "restconf": {
            "status": restconf_status
        },
        "storage": {
            "influxdb": "written" if influx_success else "failed"
        },
        "ai_model": {
            "type": "RandomForestRegressor",
            "features": ["latency_ms", "packet_loss_percent"],
            "prediction": qos_score
        }
    }
    
    print("[Pipeline] Compliance pipeline complete")
    return report
