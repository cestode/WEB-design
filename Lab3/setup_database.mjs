import sqlite3 from 'sqlite3';
import fs from 'fs';

export function setupDatabase() {

    if (!fs.existsSync('./db')){
        fs.mkdirSync('./db');
    }
    sqlite3.verbose();
    const db = new sqlite3.Database('./db/app.db');

    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                            email VARCHAR(20) UNIQUE,
                            login VARCHAR(20),
                            phone_number VARCHAR(30),
                            password VARCHAR(30),
                            sex VARCHAR(20));`);

    db.run(`CREATE TABLE IF NOT EXISTS links (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                            original_link VARCHAR(255),
                            short_link VARCHAR(255) UNIQUE,
                            user_id INT,
                            FOREIGN KEY(user_id) REFERENCES users(id));`);
    db.close();
}
