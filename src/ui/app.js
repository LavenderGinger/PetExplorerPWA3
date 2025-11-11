import { addRecord, getRecords, updateRecord, deleteRecord } from '../firebase.js';
import { addIndexedDBRecord, getIndexedDBRecords, updateIndexedDBRecord, deleteIndexedDBRecord } from '../indexedDB.js';
import { notifyUser } from './notifications.js';
import { syncIndexedDBToFirebase } from '../sync.js';

export async function createRecord(data) {
  if (navigator.onLine) {
    notifyUser('Online!');
    try {
      const id = await addRecord('pets', data);
      notifyUser('Record saved online');
      return id;
    } catch (error) {
      notifyUser(`Online save failed: ${error.message}. Saving offline.`);
      data.synced = false;
      await addIndexedDBRecord(data);
    }
  } else {
    notifyUser('Offline!');
    data.synced = false;
    data.id = 'local-'+Math.floor(Math.random()*10000);
    await addIndexedDBRecord(data);
    notifyUser(`You are offline, record ${data} saved locally`);
  }
}

// Read all records from online or offline storage
export async function readRecords() {
  if (navigator.onLine) {
    try {
      return await getRecords('pets');
    } catch (error) {
      notifyUser(`Error fetching online records: ${error.message}. Falling back to offline data.`);
      return await getIndexedDBRecords();
    }
  } else {
    return await getIndexedDBRecords();
  }
}

// Update a record by ID (online or offline)
export async function updateRecordById(id, data) {
  if (navigator.onLine) {
    try {
      await updateRecord('pets', id, data);
      notifyUser('Record updated online');
    } catch (error) {
      notifyUser(`Online update failed: ${error.message}. Saving update offline.`);
      data.id = id;
      data.synced = false;
      await updateIndexedDBRecord(data);
    }
  } else {
    data.id = id;
    data.synced = false;
    await updateIndexedDBRecord(data);
    notifyUser('You are offline, update saved locally');
  }
}

// Delete a record by ID (online or offline)
export async function deleteRecordById(id) {
  if (navigator.onLine) {
    try {
      await deleteRecord('pets', id);
      notifyUser('Record deleted online');
    } catch (error) {
      notifyUser(`Online delete failed: ${error.message}. Marking offline delete.`);
      await deleteIndexedDBRecord(id);
    }
  } else {
    await deleteIndexedDBRecord(id);
    notifyUser('You are offline, delete saved locally');
  }
}

// Sync offline data when back online
window.addEventListener('online', () => {
  notifyUser("You're back online! Syncing offline data...");
  syncIndexedDBToFirebase().catch(error => notifyUser(`Sync failed: ${error.message}`));
});

// DOM load event for form interaction
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('petForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const petName = form.petName.value.trim();
    const petType = form.petType.value.trim();

    if (petName && petType) {
      notifyUser('Got name and type, moving in');
      try {
        notifyUser('Just before create record');
        await createRecord({ name: petName, type: petType, synced: false });
        notifyUser('Pet saved successfully!');
        form.reset();
      } catch (err) {
        notifyUser('Failed to save pet: ' + err.message);
      }
    } else {
      notifyUser('Please fill out both fields.');
    }
  });
});

