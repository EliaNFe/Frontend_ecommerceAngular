import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastTrayComponent } from './shared/toast-tray.component';

@Component({
  selector: 'sb-root',
  standalone: true,
  imports: [RouterOutlet, ToastTrayComponent],
  template: `
    <router-outlet />
    <sb-toast-tray />
  `,
})
export class AppComponent {}
