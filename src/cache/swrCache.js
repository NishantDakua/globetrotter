import { openDB } from 'idb';

const DB_NAME = 'GlobalTrotter_Cache';
const STORE_NAME = 'swr_store';

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

export async function getCachedData(key) {
  try {
    const db = await getDB();
    return await db.get(STORE_NAME, key);
  } catch (err) {
    console.warn('IndexedDB read error:', err);
    return null;
  }
}

export async function setCachedData(key, value) {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, value, key);
  } catch (err) {
    console.warn('IndexedDB write error:', err);
  }
}

// In-flight request deduplication map
const pendingRequests = new Map();

/**
 * Deduplicate in-flight API fetch requests
 */
export function deduplicatedFetch(key, fetcher) {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = fetcher()
    .finally(() => {
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, promise);
  return promise;
}
