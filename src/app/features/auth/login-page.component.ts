import { Component } from '@angular/core';
import { PagePlaceholderComponent } from '../../shared/components/page-placeholder.component';

@Component({
  imports: [PagePlaceholderComponent],
  template: '<main class="login-page"><app-page-placeholder title="Connexion" /></main>',
  styles: `
    .login-page {
      min-height: 100vh;
      box-sizing: border-box;
      padding: 64px 24px;
      background: #f8f9fc;
    }
  `,
})
export class LoginPageComponent {}
