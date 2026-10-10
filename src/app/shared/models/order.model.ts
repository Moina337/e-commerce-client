export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  productIds: string[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
