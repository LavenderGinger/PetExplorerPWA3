import { openDB } from "https://unpkg.com/idb?module";

const DB_NAME = "PetExplorerDB";
const STORE_NAME = "pets";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        });
        store.createIndex("synced", "synced");
      }
    },
  });
}

export async function addIndexedDBRecord(record) {
  const db = await initDB();
  return db.add(STORE_NAME, record); // safer to use add for new records
}

export async function getIndexedDBRecords() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function updateIndexedDBRecord(record) {
  const db = await initDB();
  return db.put(STORE_NAME, record);
}

export async function deleteIndexedDBRecord(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}