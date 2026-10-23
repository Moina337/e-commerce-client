import { Injectable, computed, effect, signal } from '@angular/core';
import { ShopProduct } from '../../shared/models/shop-product.model'; 

export interface CartItem {
  product: ShopProduct;
  quantity: number;
}

const STORAGE_KEY = 'shop-cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this.load());

  readonly count = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity, 0),
  );
  readonly total = computed(() =>
    this.items().reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  );

  constructor() {
    // Sauvegarde automatique à chaque changement du panier
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
      } catch {
        /* stockage indisponible : on ignore */
      }
    });
  }

  add(product: ShopProduct): void {
    this.items.update((list) => {
      const existing = list.find((i) => i.product.id === product.id);
      if (existing) {
        return list.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...list, { product, quantity: 1 }];
    });
  }

  increase(productId: number): void {
    this.items.update((list) =>
      list.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  }

  decrease(productId: number): void {
    this.items.update((list) =>
      list
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0), // à 0, la ligne disparaît
    );
  }

  remove(productId: number): void {
    this.items.update((list) => list.filter((i) => i.product.id !== productId));
  }

  clear(): void {
    this.items.set([]);
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}