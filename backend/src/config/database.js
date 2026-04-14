import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/nexusmind.db');
let db = null;

export async function initializeDatabase() {
  const SQL = await initSqlJs();
  
  let dbBuffer;
  if (fs.existsSync(dbPath)) {
    dbBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(dbBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT UNIQUE,
      balance REAL DEFAULT 0.0,
      api_key TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      role TEXT DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      provider TEXT NOT NULL,
      input_price REAL NOT NULL,
      output_price REAL NOT NULL,
      system_prompt TEXT,
      logo_url TEXT,
      api_format TEXT NOT NULL,
      intelligence_level INTEGER DEFAULT 100,
      quality_level TEXT DEFAULT 'high',
      enabled_domains TEXT,
      swe_bench REAL DEFAULT 0,
      arc_agi REAL DEFAULT 0,
      gpqa REAL DEFAULT 0,
      mmlu REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS model_configs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model_id INTEGER NOT NULL,
      config_key TEXT NOT NULL,
      config_value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (model_id) REFERENCES models(id)
    );

    CREATE TABLE IF NOT EXISTS knowledge_base (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      fragment_id TEXT,
      content TEXT NOT NULL,
      fragment_type TEXT,
      importance REAL DEFAULT 0.5,
      embedding TEXT,
      tags TEXT,
      access_count INTEGER DEFAULT 0,
      last_accessed DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      model_id INTEGER NOT NULL,
      input_tokens INTEGER DEFAULT 0,
      output_tokens INTEGER DEFAULT 0,
      prompt_tokens INTEGER DEFAULT 0,
      completion_tokens INTEGER DEFAULT 0,
      cost REAL DEFAULT 0.0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (model_id) REFERENCES models(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  try {
    db.run(`ALTER TABLE models ADD COLUMN swe_bench REAL DEFAULT 0`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE models ADD COLUMN arc_agi REAL DEFAULT 0`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE models ADD COLUMN gpqa REAL DEFAULT 0`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE models ADD COLUMN mmlu REAL DEFAULT 0`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE requests ADD COLUMN prompt_tokens INTEGER DEFAULT 0`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE requests ADD COLUMN completion_tokens INTEGER DEFAULT 0`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE knowledge_base ADD COLUMN user_id INTEGER`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE knowledge_base ADD COLUMN fragment_id TEXT`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE knowledge_base ADD COLUMN fragment_type TEXT`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE knowledge_base ADD COLUMN importance REAL DEFAULT 0.5`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE knowledge_base ADD COLUMN access_count INTEGER DEFAULT 0`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE knowledge_base ADD COLUMN last_accessed DATETIME`);
  } catch (e) {}

  saveDatabase();
  logger.info('Database initialized successfully');
}

function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export function prepare(sql) {
  return {
    run: (...params) => {
      const stmt = db.prepare(sql);
      if (params.length > 0) {
        stmt.bind(params);
      }
      stmt.run();
      saveDatabase();
      stmt.free();
      return { lastInsertRowid: db.getRowsModified() };
    },
    get: (...params) => {
      const stmt = db.prepare(sql);
      if (params.length > 0) {
        stmt.bind(params);
      }
      const hasRow = stmt.step();
      const result = hasRow ? stmt.getAsObject() : null;
      stmt.free();
      return result;
    },
    all: (...params) => {
      const stmt = db.prepare(sql);
      if (params.length > 0) {
        stmt.bind(params);
      }
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    }
  };
}

export default { prepare, saveDatabase };
