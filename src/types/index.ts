export interface VendorLocation {
  address: string;
  locationZipCode: string;
  name: string;
  phoneNumber: string;
  serviceZipCodes: string[];
}

export interface VendorInfo {
  name: string;
  locations: VendorLocation[];
}

export interface ServiceOrder {
  id: string;
  customerName: string;
  phone: string;
  modelNumber: string;
  procId: string;
  booking: string;
  notes: string;
  status: 'parts-ordered' | 'needs-tech' | 'waiting' | 'none';
  address: string;
  vendorInfo?: VendorInfo;
}

export interface ParsedData {
  serviceOrder: string;
  customerName: string;
  phone: string;
  modelNumber: string;
  procId: string;
  booking: string;
  notes: string;
  address: string;
}


