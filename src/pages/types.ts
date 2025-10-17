export interface OrderItem {
  productId: string;
  id?: string; // Añadido para identificar el item de la orden
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
  // Campos para el formulario
  country?: string;
  city?: string;
  addressLine?: string;
  // Campos adicionales de ApiOrder para mostrar
  customerId?: string;
  billingAddress?: string;
  couponCode?: string | null;
  discountAmount?: number;
  shippingCost?: number | null;
  trackingNumber?: string | null;
}

// Interfaz que coincide con la respuesta de la API de órdenes
export interface ApiOrder {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string; // "PENDING", "COMPLETED", "CANCELLED", "PROCESSING"
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

// Interfaz para la respuesta paginada de la API de órdenes
export interface PaginatedOrdersResponse {
  content: ApiOrder[];
  totalElements: number;
}