import { ProductImage } from './product-image.model';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  images: ProductImage[];
  category: { id: number; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}
