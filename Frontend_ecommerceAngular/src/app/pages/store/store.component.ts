import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { AuthService } from "../../core/auth.service";
import { CartService } from "../../core/cart.service";
import { ProductsService } from "../../core/products.service";
import { OrdersService } from "../../core/orders.service";
import { ToastService } from "../../core/toast.service";
import { friendlyError } from "../../core/http-error";
import { Order, Page, Product } from "../../core/models";
@Component({
  selector: "sb-store",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<header class="site-head">
      <a class="wordmark" routerLink="/"><span>✦</span> Sotobosque</a>
      <nav>
        <a routerLink="/catalogo" routerLinkActive="active">Catálogo</a
        ><a routerLink="/cuenta" routerLinkActive="active">Mi cuenta</a>
      </nav>
      <div class="head-actions">
        @if (auth.isAdmin()) {
          <a class="admin-link" routerLink="/admin">Administrar</a>
        }
        @if (auth.loggedIn()) {
          <button class="link-btn" (click)="logout()">Salir</button>
        } @else {
          <a routerLink="/login">Ingresar</a>
        }
        <a class="cart-link" routerLink="/carrito" aria-label="Carrito"
          >Bolsa <b>{{ cart.count() }}</b></a
        >
      </div>
    </header>
    <main><router-outlet /></main>
    <footer>
      <a class="wordmark" routerLink="/">Sotobosque</a>
      <p>Objetos elegidos para una vida más simple.</p>
      <span>Argentina</span>
    </footer>`,
})
export class StoreComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  private r = inject(Router);
  logout() {
    this.auth.logout();
    this.r.navigateByUrl("/");
  }
}
