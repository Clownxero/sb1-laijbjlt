import { db } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { VendorLocation } from '../types';

export const firebaseOperations = {
  getAllVendors: async () => {
    const vendorsRef = collection(db, 'vendors');
    const querySnapshot = await getDocs(vendorsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
  },
  getAllLocations: async () => {
    const locationsRef = collection(db, 'locations');
    const querySnapshot = await getDocs(locationsRef);
    return querySnapshot.docs.map(doc => doc.data() as VendorLocation);
  },
  getLocationsByVendor: async (vendorId: string) => {
    const locationsRef = collection(db, 'locations');
    const q = query(locationsRef, where('vendorId', '==', vendorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as VendorLocation);
  }
};