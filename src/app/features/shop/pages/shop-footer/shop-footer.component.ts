import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-shop-footer',
  imports: [RouterLink],
  templateUrl: './shop-footer.component.html',
  styleUrl: './shop-footer.component.css',
})
export class ShopFooterComponent {
  private readonly auth = inject(AuthService);

  // Le token revient après un F5, contrairement à currentUser : on s'appuie sur lui
  readonly isLoggedIn = computed(() => !!this.auth.accessToken());

  readonly year = new Date().getFullYear();
}