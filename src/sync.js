import { getIndexedDBRecords, updateIndexedDBRecord } from './indexedDB.js';
import { addRecord, updateRecord } from './firebase.js';
import { notifyUser } from './ui/notifications.js';

export async function syncIndexedDBToFirebase() {
  const records = await getIndexedDBRecords();
  for (const record of records) {
    if (!record.synced) {
      try {
        if (record.id.startsWith('firebase-')) {
          const firebaseId = record.id.replace('firebase-', '');
          await updateRecord('pets', firebaseId, record);
        } else {
          const newId = await addRecord('pets', record);
          record.id = 'firebase-' + newId;
        }
        record.synced = true;
        await updateIndexedDBRecord(record);
        notifyUser('Offline data synced');
      } catch (error) {
        notifyUser('Sync error: ' + error.message);
      }
    }
  }
}

window.addEventListener('online', () => {
  syncIndexedDBToFirebase();
});