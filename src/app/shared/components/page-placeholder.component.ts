import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-placeholder',
  standalone: true,
  template: '<h1>{{ title() }}</h1>',
  styles: `
    :host {
      display: block;
      max-width: 960px;
      margin: 0 auto;
    }

    h1 {
      margin: 0;
      color: #1c2740;
      font-size: clamp(26px, 4vw, 34px);
      font-weight: 600;
    }
  `,
})
export class PagePlaceholderComponent {
  readonly title = input.required<string>();
}
