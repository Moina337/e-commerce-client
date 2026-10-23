import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.css',
  host: { '[class.is-full-width]': 'fullWidth()' },
})
export class AppButtonComponent {
  readonly variant = input<'primary' | 'secondary'>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly fullWidth = input(false);
  readonly clicked = output<MouseEvent>();
}