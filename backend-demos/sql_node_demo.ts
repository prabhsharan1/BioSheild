import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// --- BioShield SQL Database Demo ---
// This script demonstrates how to manage greenhouse data using a 
// relational SQL database (SQLite), ideal for local data persistence.

async function setupDatabase() {
    // Open the database file
    const db = await open({
        filename: './bioshield_local.db',
        driver: sqlite3.Database
    });

    // Create tables for zones and pest tasks
    await db.exec(`
        CREATE TABLE IF NOT EXISTS zones (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            risk_level TEXT CHECK(risk_level IN ('Safe', 'Warning', 'Danger')),
            temp REAL,
            humidity REAL,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            zone_id TEXT,
            row_number TEXT,
            threat TEXT,
            action TEXT,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (zone_id) REFERENCES zones(id)
        );
    `);

    console.log("✅ BioShield SQL Database Initialized");
    return db;
}

async function insertMockData(db) {
    // Insert a sample zone
    await db.run(
        'INSERT OR REPLACE INTO zones (id, name, risk_level, temp, humidity) VALUES (?, ?, ?, ?, ?)',
        ['C', 'Zone C', 'Warning', 28.5, 45.0]
    );

    // Insert a sample task
    await db.run(
        'INSERT INTO tasks (zone_id, row_number, threat, action) VALUES (?, ?, ?, ?)',
        ['C', '12', 'Spider Mite', 'Treatment']
    );

    console.log("📊 Mock data inserted into SQL.");
}

async function queryTasks(db) {
    const tasks = await db.all('SELECT * FROM tasks WHERE status = ?', ['Pending']);
    console.log("📋 Pending Tasks:", tasks);
}

// Example Execution
// setupDatabase().then(async (db) => {
//     await insertMockData(db);
//     await queryTasks(db);
// });

console.log("🚀 BioShield SQL Node.js Demo Ready. Requires 'sqlite3' and 'sqlite' packages.");
