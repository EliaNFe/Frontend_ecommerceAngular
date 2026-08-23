import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-leaf-spinner',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 48 48"
      class="leaf-spin"
      fill="none"
    >
      <path
        d="M24 4C13 6 6 15 6 25c0 8 6 15 14 17 1-9 2-19 10-27 4-4 9-6 14-7-2 9-6 16-13 21-4 3-9 4-14 3"
        stroke="var(--forest-deep)"
        stroke-width="3.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  styles: [
    `
      :host { display: inline-flex; }
      .leaf-spin {
        animation: leaf-sway 1.1s ease-in-out infinite;
        transform-origin: center;
      }
      @keyframes leaf-sway {
        0%, 100% { transform: rotate(-8deg) scale(1); opacity: 0.7; }
        50% { transform: rotate(8deg) scale(1.05); opacity: 1; }
      }
      @media (prefers-reduced-motion: reduce) {
        .leaf-spin { animation: none; }
      }
    `,
  ],
})
export class LeafSpinnerComponent {
  @Input() size = 22;
}
