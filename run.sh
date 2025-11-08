#!/bin/bash

# Quick start script for telecom assurance platform

echo "Starting Telecom Assurance Platform..."

# Ensure services are running
echo "Verifying InfluxDB..."
sudo systemctl start influxdb
sleep 1

echo "Verifying Grafana..."
sudo systemctl start grafana-server
sleep 1

echo "Verifying SNMP..."
sudo systemctl start snmpd 2>/dev/null || echo "SNMP not available, continuing..."
sleep 1

# Activate virtual environment and run Flask app
echo "Activating Python environment..."
source venv/bin/activate

echo "Starting Flask API Server..."
python backend/app.py
