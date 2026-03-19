-- BioShield Database Schema (SQL)
-- This file defines the structure for a relational database 
-- to manage greenhouse zones, tasks, and historical pest data.

-- 1. Greenhouse Zones Table
CREATE TABLE zones (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    risk_level VARCHAR(10) CHECK (risk_level IN ('Safe', 'Warning', 'Danger')),
    temp DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Pest Management Tasks Table
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zone_id VARCHAR(10),
    row_number VARCHAR(10),
    threat VARCHAR(50),
    action VARCHAR(50) CHECK (action IN ('Prune', 'Treatment', 'Inspect')),
    status VARCHAR(15) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (zone_id) REFERENCES zones(id)
);

-- 3. Historical Pest Data Table (for AI training)
CREATE TABLE pest_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zone_id VARCHAR(10),
    pest_type VARCHAR(50),
    severity_level INTEGER,
    temp_at_time DECIMAL(5, 2),
    humidity_at_time DECIMAL(5, 2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zone_id) REFERENCES zones(id)
);

-- Sample Data Insertion
INSERT INTO zones (id, name, risk_level, temp, humidity) VALUES ('A', 'Zone A', 'Safe', 24.0, 65.0);
INSERT INTO zones (id, name, risk_level, temp, humidity) VALUES ('B', 'Zone B', 'Safe', 25.0, 62.0);
INSERT INTO zones (id, name, risk_level, temp, humidity) VALUES ('C', 'Zone C', 'Warning', 28.0, 45.0);
INSERT INTO zones (id, name, risk_level, temp, humidity) VALUES ('D', 'Zone D', 'Safe', 23.0, 68.0);
