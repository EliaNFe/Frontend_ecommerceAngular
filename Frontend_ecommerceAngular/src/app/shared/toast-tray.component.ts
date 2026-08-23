import { Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'sb-toast-tray',
  standalone: true,
  template: `
    <div class="tray">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="'k-' + t.kind" (click)="toast.dismiss(t.id)">
          {{ t.text }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .tray {
        position: fixed;
        bottom: 22px;
        right: 22px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 999;
        max-width: min(340px, calc(100vw - 32px));
      }
      .toast {
        background: #f5f1e8;
        color: #1c2921;
        border: 1px solid #d9c9ae;
        border-radius: 12px;
        padding: 13px 16px;
        font-size: 13.5px;
        box-shadow: 0 12px 30px rgba(18, 35, 26, 0.24);
        cursor: pointer;
        animation: sb-rise 0.25s ease;
      }
      .k-ok { border-left: 4px solid var(--forest-deep); }
      .k-warn { border-left: 4px solid var(--sand-deep); }
      .k-err { border-left: 4px solid var(--blush-deep); }
    `,
  ],
})
export class ToastTrayComponent {
  toast = inject(ToastService);
}
