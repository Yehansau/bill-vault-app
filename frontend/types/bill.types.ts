export interface BillItem {
  id: string
  name: string
  price: number
  category: string
  category_confidence: number
  warranty_detected: boolean
  warranty_confidence: number
  warranty?: Warranty         // attached warranty if user added one
}

export interface Bill {
  id: string
  upload_type: 'receipt' | 'warranty'
  language: 'english' | 'sinhala' | 'tamil'
  merchant: string
  bill_date: string           // ISO date string
  total_amount: number
  firebase_image_url: string
  status: 'processing' | 'completed' | 'failed'
  items: BillItem[]
  created_at: string
}

export interface Warranty {
  id: string
  bill_id: string
  bill_item_id?: string       // null if standalone warranty
  item_name: string
  merchant: string
  purchase_date: string
  warranty_period_months: number
  expiry_date: string
  notify_date: string
  notes?: string
  warranty_card_image_url?: string
}

// What the backend returns from /upload/ endpoint
export interface UploadResponse {
  firebase_url: string
  image_hash: string
  is_duplicate: boolean
  existing_bill?: Bill        // only present if is_duplicate is true
}

// What the backend returns from /process/ endpoint
export interface ProcessResponse {
  merchant: string
  bill_date: string
  total_amount: number
  language: string
  items: BillItem[]
}

export interface SaveBillPayload {
  firebase_url: string;
  upload_type: 'receipt' | 'warranty';
  language: string;
  merchant: string;
  bill_date: string;
  total_amount: number;
  items: BillItem[];
}