import { OrderStatus } from './order.model';

// Libellé français de chaque statut renvoyé par l'API
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  PREPARING: 'En préparation',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

// Intl est intégré au navigateur : pas de locale à enregistrer (évite l'erreur NG0701)
export function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(iso));
}