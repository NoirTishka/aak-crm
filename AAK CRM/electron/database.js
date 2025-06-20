import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'aakcrm.db');
const db = new Database(dbPath);

// Версия БД
const version = db.pragma('user_version', { simple: true });

if (version === 0) {
  db.exec(`
    CREATE TABLE kursant (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fio TEXT NOT NULL,
      iin TEXT NOT NULL,
      phone TEXT NOT NULL,
      registered_at TEXT NOT NULL,
      avtomektep_start TEXT NOT NULL,
      payment INTEGER NOT NULL,
      bookBought INTEGER NOT NULL,
      bookGiven TEXT,
      video INTEGER NOT NULL,
      tests INTEGER NOT NULL,
      autodrome INTEGER NOT NULL,
      practiceTaken INTEGER NOT NULL,
      practiceCount INTEGER NOT NULL
    );
    PRAGMA user_version = 1;
  `);
}

function addKursant(data) {
  const stmt = db.prepare(`
    INSERT INTO kursant (
      fio, iin, phone, registered_at, avtomektep_start,
      payment, bookBought, bookGiven,
      video, tests, autodrome,
      practiceTaken, practiceCount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.fio,
    data.iin,
    data.phone,
    data.registered_at,
    data.avtomektep_start,
    data.payment,
    data.bookBought ? 1 : 0,
    data.bookBought ? data.bookGiven : null,
    data.materials.video ? 1 : 0,
    data.materials.tests ? 1 : 0,
    data.materials.autodrome ? 1 : 0,
    data.practice.taken ? 1 : 0,
    data.practice.taken ? data.practice.count : 0
  );
}

function getAllKursants() {
  return new Promise((resolve, reject) => {
    try {
      const rows = db.prepare('SELECT * FROM kursant').all();

      const normalized = rows.map(row => {
        const {
          video,
          tests,
          autodrome,
          practiceTaken,
          practiceCount,
          ...rest
        } = row;

        return {
          ...rest,
          bookBought: Boolean(row.bookBought),
          materials: {
            video: Boolean(video),
            tests: Boolean(tests),
            autodrome: Boolean(autodrome)
          },
          practice: {
            taken: Boolean(practiceTaken),
            count: Number(practiceCount)
          }
        };
      });
      resolve(normalized);
    } catch (e) {
      reject(e);
    }
  });
}


export { getAllKursants, addKursant };
