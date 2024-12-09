import { openDB } from 'idb';
import type { ServiceOrder } from '../types';

const DB_NAME = 'service-orders-db';
const STORE_NAME = 'orders';

export async function initDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp');
      }
    },
  });
  return db;
}

export async function saveOrder(order: ServiceOrder) {
  const db = await initDB();
  await db.put(STORE_NAME, {
    ...order,
    timestamp: new Date().toISOString()
  });
}

export async function getAllOrders(): Promise<ServiceOrder[]> {
  const db = await initDB();
  return db.getAllFromIndex(STORE_NAME, 'timestamp');
}

export async function clearAllOrders() {
  const db = await initDB();
  await db.clear(STORE_NAME);
}