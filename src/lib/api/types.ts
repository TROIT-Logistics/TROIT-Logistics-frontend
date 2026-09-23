export type UserRole = 'buyer' | 'seller' | 'rider' | 'field_agent' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string | null;
  role: UserRole;
  created_at: string;
}

export type ProductVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type ProductAuthenticityStatus = 'UNINSPECTED' | 'VERIFIED' | 'REJECTED' | string;
export type AfricanMadeCategory = 'ELECTRONICS' | 'HOME_APPLIANCES' | 'FURNITURE' | string;

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  storage_key?: string;
  mime_type: string;
  file_size: number;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  price: number;
  condition: string;
  stock: number;
  verification_status: ProductVerificationStatus;
  status?: ProductVerificationStatus;
  authenticity_status: ProductAuthenticityStatus;
  last_inspected_at?: string | null;
  is_african_made: boolean;
  african_made_category?: AfricanMadeCategory | null;
  warranty_months: number;
  warranty_terms?: string | null;
  images: ProductImage[];
  is_archived: boolean;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  condition?: string;
  is_african_made?: boolean;
  african_made_category?: AfricanMadeCategory | null;
  warranty_months?: number;
  warranty_terms?: string | null;
}

export interface UpdateStockPayload {
  stock: number;
}

export interface ArchiveProductPayload {
  archived: boolean;
}

export interface ReorderImagesPayload {
  image_ids: string[];
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PROTECTED' | 'RELEASED';

export type DeliveryStatus = 'PENDING' | 'PICKUP_PENDING' | 'PICKUP_READY' | 'IN_TRANSIT' | 'DELIVERED';

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  escrow_id?: number | null;
  blockchain_tx_hash?: string | null;
  funding_tx_hash?: string | null;
  release_tx_hash?: string | null;
  refund_tx_hash?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PickupInspection {
  id: string;
  order_id: string;
  inspector_id?: string | null;
  condition: string;
  notes?: string | null;
  inspection_status: 'PENDING' | 'PASSED' | 'FAILED';
  created_at: string;
}

export type SellerTrustLevel = 'LV1' | 'LV2' | 'LV3' | 'LV4' | 'LV5' | string;
export type SellerGrade = 'Grade C' | 'Grade B' | 'Grade A' | string;

export interface SellerProfile {
  id?: string;
  seller_id?: string;
  user_id: string;
  store_name?: string | null;
  store_address?: string | null;
  trust_level: SellerTrustLevel;
  seller_grade: SellerGrade;
  successful_transactions: number;
  fulfillment_rate: number;
  verification_status: string;
  created_at: string;
  updated_at?: string;
}

export interface SellerVerificationStatusResponse {
  seller_id: string;
  verification_status: string;
  store_name?: string | null;
  store_address?: string | null;
  kyc_completed: boolean;
  store_verified: boolean;
  physical_inspection_passed: boolean;
}

export interface InspectionReport {
  id: string;
  product_id: string;
  order_id?: string | null;
  inspector_id?: string | null;
  authenticity_verified: boolean;
  physical_condition: string;
  serial_number?: string | null;
  functional_tests?: Record<string, unknown> | null;
  photos_json?: Record<string, unknown> | null;
  notes?: string | null;
  created_at: string;
}

export interface ProductVerificationSummary {
  product_id: string;
  product_name: string;
  verification_status: string;
  authenticity_status: string;
  last_inspected_at?: string | null;
  physical_condition: string;
  seller_id: string;
  seller_trust_level?: string | null;
  seller_grade?: string | null;
  has_inspection_report: boolean;
}

export interface TrustHistory {
  id: string;
  seller_id: string;
  old_level: string;
  new_level: string;
  reason: string;
  trigger_transaction_id?: string | null;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id?: string;
  buyer_id?: string;
  product_id: string;
  product?: Product | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export interface SubscriptionEntitlements {
  max_active_listings?: number | null;
  advanced_analytics_enabled: boolean;
  business_insights_enabled: boolean;
  priority_verification_enabled: boolean;
}

export interface Subscription {
  id: string;
  seller_id: string;
  plan_tier: string;
  status: string;
  expires_at?: string | null;
  entitlements?: SubscriptionEntitlements;
  created_at: string;
}

export interface FundOrderRequest {
  tx_hash?: string | null;
  signed_tx_xdr?: string | null;
}

export interface ConfirmDeliveryRequest {
  tx_hash?: string | null;
  signed_tx_xdr?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface SeedResponse {
  success: boolean;
  message: string;
  demo_seller_email: string;
  demo_buyer_email: string;
  demo_password: string;
  seeded_products: Product[];
}

export interface VisualSearchQueryInfo {
  category?: string;
  brand?: string;
  model?: string;
  description?: string;
  confidence?: number;
}

export interface VisualSearchMatchItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  condition: string;
  verification_status: ProductVerificationStatus;
  image_url?: string;
  match_score?: number;
  description?: string;
}

export interface VisualSearchResponse {
  query?: VisualSearchQueryInfo;
  matches: VisualSearchMatchItem[];
}

export interface AdminSellerItem {
  seller_id: string;
  user_id: string;
  store_name?: string | null;
  store_address?: string | null;
  trust_level: string;
  seller_grade: string;
  successful_transactions: number;
  fulfillment_rate: number;
  verification_status: string;
  user_full_name: string;
  user_email: string;
  user_phone?: string | null;
  total_products: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

export interface AdminSellerListResponse {
  items: AdminSellerItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AdminSellerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  verification_status?: string;
}

export interface AdminUserItem {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUserListResponse {
  items: AdminUserItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AdminUserQueryParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}



