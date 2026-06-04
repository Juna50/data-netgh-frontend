export type NetworkType = 'mtn' | 'airteltigo' | 'telecel';
export type ProductType = 'data_bundle' | 'result_checker';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type CheckerNetwork = 'WASSCE' | 'BECE';

export interface Product {
  _id?: string;
  id?: string;
  product_type: ProductType;
  network: string;
  name: string;
  description: string | null;
  size: string;
  price: number;
  duration: string;
  is_active: boolean;
  moolre_enabled: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  product_id: string;
  product_snapshot: Product;
  recipient_number: string;
  payment_number: string;
  payment_network: string;
  amount: number;
  status: OrderStatus;
  payment_reference: string | null;
  payment_status: string;
  delivery_status: string;
  delivery_reference: string | null;
  customer_email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  product_name?: string;
  product_network?: string;
}

export interface OrderStatusResponse {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: string;
  delivery_status: string;
  amount: number;
  recipient_number: string;
  createdAt: string;
  product_name: string;
  network: string;
  size: string;
}

export interface CheckoutPayload {
  product_id: string;
  recipient_number: string;
  payment_number: string;
  payment_network: string;
  customer_email?: string;
}

export interface CheckoutResponse {
  order_id: string;
  order_number: string;
  amount: number;
  payment_reference: string;
  message: string;
  status: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'sub_admin';
}

export interface DashboardStats {
  total_orders: string;
  completed_orders: string;
  pending_orders: string;
  failed_orders: string;
  orders_today: string;
  total_revenue: string;
  revenue_today: string;
  revenue_this_month: string;
}

export interface AppSettings {
  maintenance_mode: string;
  mtn_notice_enabled: string;
  mtn_notice_message: string;
  site_name: string;
  support_whatsapp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
