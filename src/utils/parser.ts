import type { ParsedData } from '../types';

export function parseServiceOrderText(text: string): ParsedData {
  if (!text.trim()) {
    throw new Error('Please enter service order text');
  }

  // Extract each field with more robust patterns
  const serviceOrder = text.match(/(\d{7}-\d{8})/)?.[1];
  const customerName = text.match(/Name\s*:\s*([^\n]+)/i)?.[1]?.trim() || 
                      text.match(/Name([^]*?)(?=Phone)/s)?.[1]?.trim();
  const phone = text.match(/Phone\s*:\s*(\d+)/i)?.[1] || 
                text.match(/Phone(\d+)/)?.[1];
  const modelNumber = text.match(/Model Number\s*:\s*([^\n]+)/i)?.[1]?.trim() || 
                     text.match(/Model Number([^]*?)(?=Estimated)/s)?.[1]?.trim();
  const procId = text.match(/PROCID\s*:\s*([^\n]+)/i)?.[1]?.trim() || 
                 text.match(/PROCID([^]*?)(?=Authority)/s)?.[1]?.trim();
  const booking = text.match(/Original Booking\s*:\s*([^\n]+)/i)?.[1]?.trim() || 
                 text.match(/Original Booking:([^]*?)(?=Status)/s)?.[1]?.trim();
  const notes = text.match(/Service Description\s*:\s*([^\n]+)/i)?.[1]?.trim() || 
                text.match(/Service Description([^]*?)(?=Trip)/s)?.[1]?.trim();
  const address = text.match(/Service Address\s*:\s*([^\n]+)/i)?.[1]?.trim() || 
                 text.match(/Service Address([^]*?)$/s)?.[1]?.trim();

  // Validate required fields
  if (!serviceOrder) {
    throw new Error('Service order number not found. Expected format: 0008175-11437075');
  }
  if (!customerName) {
    throw new Error('Customer name not found. Please check the format.');
  }
  if (!phone) {
    throw new Error('Phone number not found. Please check the format.');
  }

  return {
    serviceOrder,
    customerName,
    phone,
    modelNumber: modelNumber || '',
    procId: procId || '',
    booking: booking || '',
    notes: notes || '',
    address: address || ''
  };
}