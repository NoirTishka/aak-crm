import path from "path";
import fs from "fs";
import Database from "better-sqlite3";
import type { Kursant, FileKey, KursantInput } from "./types/kursant";
import { dialog } from "electron";
import { app } from "electron";

const dbPath = path.join(process.cwd(), "aakcrm.db");
const db = new Database(dbPath);
migrate();

function migrate() {
  let version = db.pragma("user_version", { simple: true });

  if (version === 0) {
    db.exec(`
    CREATE TABLE kursant (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fio TEXT NOT NULL,
      iin TEXT NOT NULL,
      phone TEXT NOT NULL,
      category TEXT NOT NULL,
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
  `);
    db.pragma("user_version = 1");
    version = 1;
  }

  if (version === 1) {
    db.exec(`ALTER TABLE kursant ADD COLUMN filePath TEXT;`);
    db.pragma("user_version = 2");
    version = 2;
  }
}

function addKursant(data: KursantInput): number {
  const stmt = db.prepare(`
    INSERT INTO kursant (
      fio, iin, phone, category, registered_at, avtomektep_start,
      payment, bookBought, bookGiven,
      video, tests, autodrome,
      practiceTaken, practiceCount,
      filePath,
      "group", examPassed,
      videoAccessOpen, videoAccessUntil,
      testsAccessOpen, testsAccessUntil,
      autodromeAccessOpen, autodromeAccessUntil
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.fio,
    data.iin,
    data.phone,
    data.category,
    data.registeredDate,
    data.avtomektep_start,
    data.payment,
    data.bookBought ? 1 : 0,
    data.bookBought ? data.bookGiven : null,
    data.materials.video ? 1 : 0,
    data.materials.tests ? 1 : 0,
    data.materials.autodrome ? 1 : 0,
    data.practice.taken ? 1 : 0,
    data.practice.count,
    JSON.stringify(data.filePaths ?? {}),
    data.group,
    data.examPassed ? 1 : 0,
    data.access.video.open ? 1 : 0,
    data.access.video.until ?? null,
    data.access.tests.open ? 1 : 0,
    data.access.tests.until ?? null,
    data.access.autodrome.open ? 1 : 0,
    data.access.autodrome.until ?? null
  );

  return Number(result.lastInsertRowid);
}

function getAllKursants(): Promise<Kursant[]> {
  return new Promise((resolve, reject) => {
    try {
      const rows = db.prepare("SELECT * FROM kursant").all();

      const normalized = rows.map((row: any) => {
        const {
          video,
          tests,
          autodrome,
          practiceTaken,
          practiceCount,
          filePath,
          videoAccessOpen,
          videoAccessUntil,
          testsAccessOpen,
          testsAccessUntil,
          autodromeAccessOpen,
          autodromeAccessUntil,
          ...rest
        } = row;

        return {
          ...rest,
          bookBought: Boolean(row.bookBought),
          examPassed: Boolean(row.examPassed),
          materials: {
            video: Boolean(video),
            tests: Boolean(tests),
            autodrome: Boolean(autodrome),
          },
          access: {
            video: {
              open: Boolean(videoAccessOpen),
              until: videoAccessUntil ?? undefined,
            },
            tests: {
              open: Boolean(testsAccessOpen),
              until: testsAccessUntil ?? undefined,
            },
            autodrome: {
              open: Boolean(autodromeAccessOpen),
              until: autodromeAccessUntil ?? undefined,
            },
          },
          practice: {
            taken: Boolean(practiceTaken),
            count: Number(practiceCount),
          },
          filePaths: filePath ? JSON.parse(filePath) : {},
        } as Kursant;
      });

      resolve(normalized);
    } catch (e) {
      reject(e);
    }
  });
}

function updateKursant(data: Kursant): void {
  const stmt = db.prepare(`
    UPDATE kursant SET
      fio = ?,
      iin = ?,
      phone = ?,
      category = ?,
      payment = ?,
      bookBought = ?,
      bookGiven = ?,
      video = ?,
      tests = ?,
      autodrome = ?,
      practiceTaken = ?,
      practiceCount = ?,
      filePath = ?,
      "group" = ?,
      examPassed = ?,
      videoAccessOpen = ?,
      videoAccessUntil = ?,
      testsAccessOpen = ?,
      testsAccessUntil = ?,
      autodromeAccessOpen = ?,
      autodromeAccessUntil = ?
    WHERE id = ?
  `);

  stmt.run(
    data.fio,
    data.iin,
    data.phone,
    data.category,
    data.payment,
    data.bookBought ? 1 : 0,
    data.bookGiven,
    data.materials.video ? 1 : 0,
    data.materials.tests ? 1 : 0,
    data.materials.autodrome ? 1 : 0,
    data.practice.taken ? 1 : 0,
    data.practice.count,
    JSON.stringify(data.filePaths ?? {}),
    data.group,
    data.examPassed ? 1 : 0,
    data.access.video.open ? 1 : 0,
    data.access.video.until ?? null,
    data.access.tests.open ? 1 : 0,
    data.access.tests.until ?? null,
    data.access.autodrome.open ? 1 : 0,
    data.access.autodrome.until ?? null,
    data.id
  );
}

function deleteKursant(id: number): void {
  const stmt = db.prepare("DELETE FROM kursant WHERE id = ?");
  stmt.run(id);
}

function searchKursants(query: string): Kursant[] {
  const stmt = db.prepare(`
    SELECT * FROM kursant
    WHERE fio LIKE ? OR iin LIKE ? OR phone LIKE ?
  `);

  const wildcard = `%${query}%`;
  const rows = stmt.all(wildcard, wildcard, wildcard);

  return rows.map((row: any) => ({
    ...row,
    bookBought: Boolean(row.bookBought),
    materials: {
      video: Boolean(row.video),
      tests: Boolean(row.tests),
      autodrome: Boolean(row.autodrome),
    },
    practice: {
      taken: Boolean(row.practiceTaken),
      count: Number(row.practiceCount),
    },
  }));
}

async function saveKursantFiles(kursantId: number, key: FileKey) {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: "Выберите файл",
    properties: ["openFile"],
  });

  if (canceled || filePaths.length === 0) return;

  const filePath = filePaths[0];

  const baseDir = app.getPath("userData");
  const destDir = path.join(baseDir, "attachments", String(kursantId));
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const fileName = path.basename(filePath);
  const destPath = path.join(destDir, fileName);
  fs.copyFileSync(filePath, destPath);

  const relativePath = path.relative(baseDir, destPath);

  const row = db
    .prepare("SELECT filePath FROM kursant WHERE id = ?")
    .get(kursantId) as { filePath?: string };
  const existing = row?.filePath ? JSON.parse(row.filePath) : {};

  const updated = { ...existing, [key]: relativePath };
  db.prepare("UPDATE kursant SET filePath = ? WHERE id = ?").run(
    JSON.stringify(updated),
    kursantId
  );

  return relativePath;
}

function deleteKursantFile(kursantId: number, key: FileKey): boolean {
  try {
    const row = db
      .prepare("SELECT filePath FROM kursant WHERE id = ?")
      .get(kursantId) as { filePath?: string };
    const stored = row?.filePath ? JSON.parse(row.filePath) : {};

    const pathToDelete = stored[key];
    if (!pathToDelete) return false;

    const absolutePath = path.join(app.getPath("userData"), pathToDelete);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    const updated = { ...stored };
    delete updated[key];

    db.prepare("UPDATE kursant SET filePath = ? WHERE id = ?").run(
      JSON.stringify(updated),
      kursantId
    );

    return true;
  } catch (error) {
    console.error("Ошибка при удалении файла курсантa:", error);
    return false;
  }
}

export {
  getAllKursants,
  addKursant,
  updateKursant,
  deleteKursant,
  searchKursants,
  saveKursantFiles,
  deleteKursantFile,
};
