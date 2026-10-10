import { Injectable, signal } from '@angular/core';
import { Category } from '../../shared/models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  readonly categories = signal<Category[]>([
    {
      id: 'cat-electronics',
      name: 'Électronique',
      description: 'Téléphones, accessoires et appareils connectés.',
      active: true,
    },
    {
      id: 'cat-home',
      name: 'Maison et cuisine',
      description: 'Ustensiles, décoration et équipement de la maison.',
      active: true,
    },
    {
      id: 'cat-fashion',
      name: 'Mode femme',
      description: 'Vêtements, chaussures et accessoires pour femme.',
      active: true,
    },
    {
      id: 'cat-sports',
      name: 'Sport et plein air',
      description: 'Équipement sportif, randonnée et activités extérieures.',
      active: true,
    },
    {
      id: 'cat-beauty',
      name: 'Beauté et bien-être',
      description: 'Soins du visage, maquillage et produits de bien-être.',
      active: false,
    },
    {
      id: 'cat-books',
      name: 'Livres et loisirs',
      description: 'Livres, jeux de société et loisirs créatifs.',
      active: true,
    },
  ]);

  getById(id: string): Category | undefined {
    return this.categories().find((category) => category.id === id);
  }

  add(name: string): void {
    this.categories.update((categories) => [
      ...categories,
      {
        id: crypto.randomUUID(),
        name,
        description: '',
        active: true,
      },
    ]);
  }

  update(id: string, name: string): boolean {
    if (!this.getById(id)) {
      return false;
    }

    this.categories.update((categories) =>
      categories.map((category) =>
        category.id === id ? { ...category, name } : category,
      ),
    );

    return true;
  }
}
