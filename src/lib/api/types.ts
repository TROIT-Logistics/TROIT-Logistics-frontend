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

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  price: number;
  condition: string;
  stock: number;
  verification_status: ProductVerificationStatus;
  created_at: string;
  updated_at: string;
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
