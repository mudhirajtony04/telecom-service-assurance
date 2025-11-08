# Telecom Service Assurance Platform

A comprehensive open-source platform for real-time monitoring and assurance of telecom network services. Integrates SNMP data collection, AI-based QoS prediction, and Grafana visualization.

## Architecture

\`\`\`
SNMP Agent (127.0.0.1:161)
    ↓
Collector (pysnmp)
    ↓
Service Logic Pipeline
    ├─ SNMP Metrics (latency, packet loss)
    ├─ RESTCONF Mock (interface status)
    └─ AI Model (QoS prediction)
    ↓
InfluxDB (127.0.0.1:8086)
    ↓
Grafana Dashboard (localhost:3000)
    ↓
Flask REST API (127.0.0.1:5000)
\`\`\`

## Prerequisites

- Ubuntu 20.04+ or Ubuntu WSL
- Python 3.8+
- Sudo access for service installation

## Installation

### 1. Automated Setup (Recommended)

\`\`\`bash
chmod +x setup.sh
./setup.sh
\`\`\`

This will:
- Install system packages (python3, snmp, snmpd, influxdb, grafana-server)
- Create and start InfluxDB service
- Create `assurance_metrics` database
- Configure SNMP agent for read-only public access
- Install Grafana server
- Create Python virtual environment
- Install Python dependencies from requirements.txt

### 2. Manual Setup

\`\`\`bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install dependencies
sudo apt-get install -y python3 python3-pip python3-venv snmp snmpd

# Install InfluxDB
wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
echo "deb https://repos.influxdata.com/ubuntu focal stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
sudo apt-get update && sudo apt-get install -y influxdb

# Install Grafana
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo apt-get update && sudo apt-get install -y grafana-server

# Create InfluxDB database
sudo systemctl start influxdb
influx -execute "CREATE DATABASE assurance_metrics"

# Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
\`\`\`

## Running the Platform

### Start Services

\`\`\`bash
# Start InfluxDB
sudo systemctl start influxdb

# Start Grafana
sudo systemctl start grafana-server

# Start SNMP (if configured)
sudo systemctl start snmpd
\`\`\`

### Run Flask API

\`\`\`bash
# Activate virtual environment
source venv/bin/activate

# Run the application
python backend/app.py
\`\`\`

The API will start on `http://127.0.0.1:5000`

### Quick Start

\`\`\`bash
chmod +x run.sh
./run.sh
\`\`\`

## API Endpoints

### Health Check
\`\`\`
GET /health
\`\`\`
Returns: Service health status

### Compliance Status (Main Endpoint)
\`\`\`
GET /assurance/compliance-status
\`\`\`
Returns: Comprehensive compliance report including:
- SLA compliance status
- QoS score (0-100)
- Network metrics (latency, packet loss)
- Interface statistics
- InfluxDB write confirmation

### Mock RESTCONF
\`\`\`
GET /mock-restconf/interface-status
\`\`\`
Returns: Mock RESTCONF device interface status

## Pipeline Execution Flow

When calling `/assurance/compliance-status`:

1. **Load AI Model** - RandomForest QoS predictor (trained or cached)
2. **Fetch SNMP Metrics** - Latency and packet loss from agent
3. **Query RESTCONF Mock** - Interface status simulation
4. **Run Prediction** - AI model predicts QoS score
5. **Evaluate SLA** - Compare QoS against threshold (85.0)
6. **Write to InfluxDB** - Store all metrics and results
7. **Return Report** - JSON response with complete data

## Visualization (Grafana)

1. Access Grafana: `http://localhost:3000`
2. Login: admin / admin
3. Add InfluxDB data source:
   - URL: `http://127.0.0.1:8086`
   - Database: `assurance_metrics`
4. Create dashboards from `assurance_metrics` measurement data

## Troubleshooting

### InfluxDB Connection Error
\`\`\`bash
# Check InfluxDB status
sudo systemctl status influxdb

# Start InfluxDB if stopped
sudo systemctl start influxdb

# Verify database exists
influx -execute "SHOW DATABASES"
\`\`\`

### SNMP Not Responding
\`\`\`bash
# Check SNMP daemon
sudo systemctl status snmpd

# Test SNMP locally
snmpget -v 1 -c public 127.0.0.1 sysUpTime.0
\`\`\`

### Grafana Not Accessible
\`\`\`bash
# Check Grafana status
sudo systemctl status grafana-server

# Verify on port 3000
curl http://localhost:3000
\`\`\`

### Flask API Port Conflict
If port 5000 is in use, edit `backend/app.py` line 66:
\`\`\`python
app.run(host='127.0.0.1', port=5001, debug=False)  # Change to different port
\`\`\`

## Project Structure

\`\`\`
telecom-assurance-platform/
├── backend/
│   └── app.py                  # Flask REST API
├── collector/
│   └── snmp_collector.py       # SNMP metrics collection
├── model/
│   ├── qos_predictor.py        # AI QoS prediction model
│   └── qos_model.pkl           # Trained model (generated)
├── service/
│   └── assurance_logic.py      # Core pipeline logic
├── requirements.txt            # Python dependencies
├── setup.sh                    # Automated setup script
├── run.sh                      # Quick start script
└── README.md                   # This file
\`\`\`

## Configuration

### InfluxDB Settings (assurance_logic.py line 22-27)
\`\`\`python
host='127.0.0.1'
port=8086
username=''          # Empty for unauthenticated
password=''          # Empty for unauthenticated
database='assurance_metrics'
\`\`\`

### SLA Threshold (assurance_logic.py line 103)
\`\`\`python
sla_threshold = 85.0  # Modify as needed
\`\`\`

### SNMP Community (snmp_collector.py line 16)
\`\`\`python
community = CommunityData('public', mpModel=0)
\`\`\`

## Performance Notes

- First request trains AI model (~2 seconds)
- Subsequent requests use cached model (~500ms)
- InfluxDB writes: ~100ms per point
- Complete pipeline execution: ~1-2 seconds

## License

Open-source platform for telecom service assurance monitoring.

## Support

For issues or questions, check the troubleshooting section above.
