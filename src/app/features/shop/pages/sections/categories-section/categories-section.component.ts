import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShopProductService } from '../../../../../core/services/shop-product.service';

@Component({
  selector: 'app-categories-section',
  imports: [RouterLink],
  templateUrl: './categories-section.component.html',
  styleUrl: './categories-section.component.css',
})
export class CategoriesSectionComponent {
  private readonly service = inject(ShopProductService);

  // Toutes les catégories : le défilement gère le trop-plein
  readonly categories = computed(() => this.service.categoryList());

  // La rangée dans le template (#row), disponible une fois affichée
  private readonly row = viewChild<ElementRef<HTMLUListElement>>('row');

  readonly canScrollLeft = signal(false);
  readonly canScrollRight = signal(false);

  constructor() {
    this.service.loadCategories();

    // Dès que la rangée existe : on la surveille (redimensionnement de la fenêtre inclus)
    effect((onCleanup) => {
      const element = this.row()?.nativeElement;
      if (!element) {
        return;
      }

      const observer = new ResizeObserver(() => this.updateArrows());
      observer.observe(element);
      this.updateArrows();

      onCleanup(() => observer.disconnect());
    });
  }

  // Appelé à chaque défilement et à chaque changement de taille
  updateArrows(): void {
    const element = this.row()?.nativeElement;
    if (!element) {
      return;
    }

    this.canScrollLeft.set(element.scrollLeft > 1);
    this.canScrollRight.set(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    );
  }

  scroll(direction: -1 | 1): void {
    const element = this.row()?.nativeElement;
    if (!element) {
      return;
    }

    // Respecte le réglage « réduire les animations » du système
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }
}