import { Component } from '@angular/core';
import { PagePlaceholderComponent } from '../../../shared/components/page-placeholder.component';

@Component({
  imports: [PagePlaceholderComponent],
  template: '<app-page-placeholder title="Clients" />',
})
export class CustomersPageComponent {}
