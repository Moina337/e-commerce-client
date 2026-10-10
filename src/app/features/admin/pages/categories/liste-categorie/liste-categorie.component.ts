import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Category } from '../../../../../shared/models/category.model';

@Component({
  imports: [MatButtonModule, MatTableModule],
  templateUrl: './liste-categorie.component.html',
  styleUrl: './liste-categorie.component.css',
})
export class CategoriesPageComponent {
  // The table reads its rows directly from this signal.
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

  readonly displayedColumns = ['name', 'status', 'actions'];
}
