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
  template: `<section class="narrow">
    <a routerLink="/carrito" class="back">← Volver a la bolsa</a>
    <p class="eyebrow">Último paso</p>
    <h1>Revisá tu compra</h1>
    @if (done) {
      <div class="result success">
        <span>✓</span>
        <h2>Compra confirmada</h2>
        <p>
          Tu orden es la #{{ done.id }} y ya podés seguirla desde tu cuenta.
        </p>
        <a class="btn btn-primary" [routerLink]="['/cuenta/ordenes', done.id]"
          >Ver mi orden</a
        >
      </div>
    } @else {
      <div class="checkout-list">
        @for (i of cart.items(); track i.product.id) {
          <div>
            <span>{{ i.cantidad }} × {{ i.product.nombre }}</span
            ><strong>{{
              i.product.precio * i.cantidad
                | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
            }}</strong>
          </div>
        }
        <div class="checkout-total">
          <span>Total</span
          ><strong>{{
            cart.total() | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
          }}</strong>
        </div>
      </div>
      @if (error) {
        <p class="form-error">{{ error }}</p>
      }
      <button
        class="btn btn-primary wide"
        [disabled]="loading || !cart.items().length"
        (click)="confirm()"
      >
        {{ loading ? "Procesando…" : "Confirmar compra" }}
      </button>
      <p class="microcopy">
        El backend procesará la orden y su pago. No se simulan cobros desde esta
        pantalla.
      </p>
    }
  </section>`,
})
export class CheckoutComponent {
  cart = inject(CartService);
  private api = inject(OrdersService);
  loading = false;
  error = "";
  done?: Order;
  confirm() {
    this.loading = true;
    this.error = "";
    this.api
      .create(
        this.cart
          .items()
          .map((i) => ({ productId: i.product.id, cantidad: i.cantidad })),
      )
      .subscribe({
        next: (o) => {
          this.done = o;
          this.cart.clear();
          this.loading = false;
        },
        error: (e) => {
          this.error = friendlyError(
            e,
            "No pudimos confirmar la compra. Revisá el stock e intentá nuevamente.",
          );
          this.loading = false;
        },
      });
  }
}
