import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ShopHeaderComponent } from '../../../shared/components/app-shop-header/shop-header.component';
import { CartDrawerComponent } from '../app-cart-drawer/cart-drawer.component';
import { ShopFooterComponent } from '../pages/shop-footer/shop-footer.component';

@Component({
  selector: 'app-shop-layout',
  imports: [MatButtonModule, MatToolbarModule, ShopFooterComponent, RouterOutlet,ShopHeaderComponent,CartDrawerComponent],
  templateUrl: './shop-layout.component.html',
  styleUrl: './shop-layout.component.css',
}) 
export class ShopLayoutComponent {
  protected readonly year = new Date().getFullYear();
}
