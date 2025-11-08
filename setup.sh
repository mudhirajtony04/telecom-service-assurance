#!/bin/bash

# Telecom Service Assurance Platform - Ubuntu WSL Setup Script
# Complete installation and configuration

set -e

echo "=========================================="
echo "Telecom Assurance Platform - Setup Script"
echo "=========================================="

# Step 1: Update system packages
echo -e "\n[1/8] Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Step 2: Install system dependencies
echo -e "\n[2/8] Installing system dependencies..."
sudo apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    snmp \
    snmpd \
    curl \
    wget

# Step 3: Install InfluxDB
echo -e "\n[3/8] Installing InfluxDB..."
# Add InfluxDB repository and install
wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
echo "deb https://repos.influxdata.com/ubuntu focal stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
sudo apt-get update
sudo apt-get install -y influxdb

# Start InfluxDB
echo -e "\n[4/8] Starting InfluxDB service..."
sudo systemctl start influxdb
sudo systemctl enable influxdb
sleep 2

# Create InfluxDB database
echo -e "\n[5/8] Creating InfluxDB database..."
influx -execute "CREATE DATABASE assurance_metrics"
influx -execute "SHOW DATABASES"

# Step 6: Install Grafana
echo -e "\n[6/8] Installing Grafana..."
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y grafana-server

# Start Grafana
echo -e "Starting Grafana service..."
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
sleep 2

# Step 7: Configure SNMP agent
echo -e "\n[7/8] Configuring SNMP agent..."
sudo tee /etc/snmp/snmpd.conf > /dev/null <<'EOF'
# SNMP Agent Configuration for Telecom Assurance
sysdescr "Telecom Assurance Test Agent"
sysservices 72

# Read-only community for monitoring
rocommunity public

# Allow local access for queries
agentAddress udp:127.0.0.1:161

# Enable trap logging
trapsink 127.0.0.1 public

# Basic system information access
com2sec readonly default public
group mygroup v1 readonly
view myview included .1
access mygroup "" any noauth exact myview none none

# Restart SNMP daemon
# Note: Only restart if snmpd is available
echo "SNMP configuration updated"
EOF

# Verify SNMP is installed and configured
if command -v snmpd &> /dev/null; then
    echo "Starting SNMP daemon..."
    sudo systemctl restart snmpd
    sudo systemctl enable snmpd
else
    echo "WARNING: snmpd not found, skipping SNMP daemon restart"
fi

# Step 8: Setup Python virtual environment and install requirements
echo -e "\n[8/8] Setting up Python environment..."
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

echo -e "\n=========================================="
echo "Setup Complete!"
echo "=========================================="
echo -e "\nNext Steps:"
echo "1. Activate virtual environment:"
echo "   source venv/bin/activate"
echo ""
echo "2. Run the Flask API:"
echo "   python backend/app.py"
echo ""
echo "3. Access services:"
echo "   Flask API:    http://127.0.0.1:5000"
echo "   Grafana:      http://localhost:3000 (admin/admin)"
echo "   InfluxDB:     http://127.0.0.1:8086"
echo ""
echo "4. Test the compliance endpoint:"
echo "   curl http://127.0.0.1:5000/assurance/compliance-status"
echo ""
echo "=========================================="
