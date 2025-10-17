export interface OrderItem {
  productId: string;
  id?: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: "Pending" | "Completed" | "Cancelled" | "Processing";
  items: OrderItem[];
  shippingAddress: string;
  country?: string;
  city?: string;
  addressLine?: string;
  customerId?: string;
  billingAddress?: string;
  couponCode?: string | null;
  discountAmount?: number;
  shippingCost?: number | null;
  trackingNumber?: string | null;
}

export interface ApiOrder {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  billingAddress: string;
  items: OrderItem[];
  couponCode: string | null;
  discountAmount: number;
  shippingCost: number | null;
  shippingMethodName: string | null;
  trackingNumber: string | null;
  finalAmount: number;
}

export interface PaginatedOrdersResponse {
  content: ApiOrder[];
  totalElements: number;
}
