export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

// Ce qu'on envoie : seulement l'id du produit et la quantité
export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

// Ce que le serveur renvoie
export interface OrderItem {
  product: { id: number; name: string; slug: string; image?: string | null };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}