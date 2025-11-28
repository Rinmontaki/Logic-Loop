const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Crear tabla si no existe (mantener nombres de columnas usados previamente)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE,
    email TEXT UNIQUE,
    contraseña TEXT
  )`);
});

// Exponer una función query que imite la forma básica de mysql2/promise -> [rows]
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    const trimmed = sql.trim().toUpperCase();
    // INSERT -> db.run (devolver insertId en objeto similar a mysql)
    if (trimmed.startsWith('INSERT')) {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        // devolver objeto similar al result de mysql
        resolve([{ insertId: this.lastID }]);
      });
      return;
    }

    // SELECT/other -> usar all para obtener filas
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve([rows]);
    });
  });
}

module.exports = { query };
