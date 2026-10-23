import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrl: './price.component.css',
})
export class PriceComponent {
  readonly value = input.required<number>();
  readonly currency = input('EUR');

  // Formate le prix avec Intl (aucune locale à enregistrer)
  readonly formatted = computed(() => {
    const currency = this.currency();
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      // XOF n'a pas de décimales, EUR en a deux
      minimumFractionDigits: currency === 'XOF' ? 0 : 2,
      maximumFractionDigits: currency === 'XOF' ? 0 : 2,
    }).format(this.value());
  });
}