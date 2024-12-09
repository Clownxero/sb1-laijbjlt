import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import type { VendorInfo, VendorLocation } from '../types';

// Function to extract zip code from an address
export function extractZipCode(address: string): string | null {
  const zipMatch = address.match(/\b\d{5}\b/);
  return zipMatch ? zipMatch[0] : null;
}

// Function to find a vendor by zip code using Firebase
export const findVendorByZip = async (zipCode: string): Promise<VendorInfo | null> => {
  try {
    const vendorsRef = collection(db, 'vendors');
    const querySnapshot = await getDocs(vendorsRef);
    const vendors = querySnapshot.docs.map(doc => doc.data() as VendorInfo);

    // Iterate through each vendor and their locations
    for (const vendor of vendors) {
      for (const location of vendor.locations) {
        if (location.serviceZipCodes.includes(zipCode)) {
          return {
            vendor: vendor.name,
            location: location.name,
            locationZip: location.locationZipCode
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding vendor by zip code:', error);
    return null;
  }
};