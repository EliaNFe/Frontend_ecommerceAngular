import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";
import { AuthService } from "../../core/auth.service";
import { ProductsService } from "../../core/products.service";
import { OrdersService } from "../../core/orders.service";
import { UsersService } from "../../core/users.service";
import { ToastService } from "../../core/toast.service";
import { friendlyError } from "../../core/http-error";
import { Order, Product, User } from "../../core/models";
@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<div class="admin-shell">
    <aside>
      <a class="wordmark" routerLink="/admin">✦ Sotobosque</a>
      <p class="eyebrow">Administración</p>
      <nav>
        <a
          routerLink="/admin"
          [routerLinkActiveOptions]="{ exact: true }"
          routerLinkActive="active"
          >Resumen</a
        ><a routerLink="/admin/productos" routerLinkActive="active">Productos</a
        ><a routerLink="/admin/ordenes" routerLinkActive="active">Órdenes</a
        ><a routerLink="/admin/clientes" routerLinkActive="active">Clientes</a>
      </nav>
      <div class="admin-user">
        <span>{{ auth.email() }}</span
        ><a routerLink="/">Ver tienda</a
        ><button (click)="logout()">Cerrar sesión</button>
      </div>
    </aside>
    <main><router-outlet /></main>
  </div>`,
})
export class AdminComponent {
  auth = inject(AuthService);
  private r = inject(Router);
  logout() {
    this.auth.logout();
    this.r.navigateByUrl("/");
  }
}
