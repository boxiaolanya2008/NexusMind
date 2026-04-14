const Database = require('sql.js');
const fs = require('fs');

const dbPath = './database.db';
let dbBuffer;
if (fs.existsSync(dbPath)) {
  dbBuffer = fs.readFileSync(dbPath);
  const db = new Database(dbBuffer);
  const users = db.exec('SELECT id, username, email, role FROM users');
  console.log(JSON.stringify(users, null, 2));
} else {
  console.log('Database file not found');
}
