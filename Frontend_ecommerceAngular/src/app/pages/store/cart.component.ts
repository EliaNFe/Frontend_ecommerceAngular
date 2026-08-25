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
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `<section class="page-head">
      <p class="eyebrow">Tu selección</p>
      <h1>Bolsa</h1>
    </section>
    @if (!cart.items().length) {
      <div class="state tall">
        <h2>Tu bolsa está vacía</h2>
        <p>Explorá la colección y encontrá algo para vos.</p>
        <a class="btn btn-primary" routerLink="/catalogo">Ver catálogo</a>
      </div>
    } @else {
      <section class="cart-layout">
        <div class="cart-list">
          @for (i of cart.items(); track i.product.id) {
            <article class="cart-row">
              <img
                [src]="i.product.imagenUrl || placeholder"
                (error)="img($event)"
              />
              <div>
                <small>{{ i.product.categoria }}</small>
                <h3>{{ i.product.nombre }}</h3>
                <button
                  class="link-btn danger"
                  (click)="cart.remove(i.product.id)"
                >
                  Eliminar
                </button>
              </div>
              <div class="qty">
                <button (click)="cart.set(i.product.id, i.cantidad - 1)">
                  −</button
                ><span>{{ i.cantidad }}</span
                ><button
                  [disabled]="i.cantidad >= i.product.stock"
                  (click)="cart.set(i.product.id, i.cantidad + 1)"
                >
                  +
                </button>
              </div>
              <strong>{{
                i.product.precio * i.cantidad
                  | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
              }}</strong>
            </article>
          }
        </div>
        <aside class="summary">
          <p>Resumen</p>
          <div>
            <span>Productos</span><span>{{ cart.count() }}</span>
          </div>
          <div class="total">
            <span>Total</span
            ><strong>{{
              cart.total()
                | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
            }}</strong>
          </div>
          <a class="btn btn-primary" routerLink="/checkout">Continuar compra</a
          ><button class="link-btn" (click)="cart.clear()">Vaciar bolsa</button>
        </aside>
      </section>
    }`,
})
export class CartComponent {
  cart = inject(CartService);
  placeholder = "assets/product-placeholder.svg";
  img(e: Event) {
    (e.target as HTMLImageElement).src = this.placeholder;
  }
}
