export interface ShopProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: { id: number; url: string }[];
  category: { id: number; name: string; slug: string };
}