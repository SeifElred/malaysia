const sqlite3 = require('sqlite3').verbose();

let db;

function openDB() {
    db = new sqlite3.Database('databases/places.db', (err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
        } else {
            console.log('Connected to the database.');
            // Create places table if it doesn't exist
            db.run(`CREATE TABLE IF NOT EXISTS places (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                photos TEXT,
                summary TEXT
            )`);
        }
    });
}

function getAllPlaces() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM places';
        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function addPlace(place) {
    return new Promise((resolve, reject) => {
        const { name, photos, summary } = place;
        const sql = `INSERT INTO places (name, photos, summary) 
                     VALUES (?, ?, ?)`;
        const values = [name, photos, summary];
    
        db.run(sql, values, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

function updatePlace(id, place) {
    return new Promise((resolve, reject) => {
        const { name, photos, summary } = place;
        const sql = `UPDATE places SET 
                     name = ?, photos = ?, summary = ? 
                     WHERE id = ?`;
        const values = [name, photos, summary, id];
    
        db.run(sql, values, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

function deletePlace(id) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM places WHERE id = ?`;
        db.run(sql, id, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

module.exports = { openDB, getAllPlaces, addPlace, updatePlace, deletePlace };
