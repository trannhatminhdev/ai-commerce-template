export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  createdAt: string | Date;
  product?: {
    id: number;
    name: string;
    images?: { imageUrl: string; isThumbnail: boolean }[];
  };
}

export interface Order {
  id: number;
  userId?: number | null;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingMethod: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  items?: OrderItem[];
}
