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
      <p class="eyebrow">Historial</p>
      <h1>Mis órdenes</h1>
    </section>
    @if (loading) {
      <div class="state">Cargando órdenes…</div>
    } @else if (error) {
      <div class="state error">{{ error }}</div>
    } @else if (!orders.length) {
      <div class="state tall">
        Todavía no realizaste ninguna compra.<a
          class="btn btn-primary"
          routerLink="/catalogo"
          >Explorar catálogo</a
        >
      </div>
    } @else {
      <div class="order-list">
        @for (o of orders; track o.id) {
          <a [routerLink]="['/cuenta/ordenes', o.id]"
            ><div>
              <small>Orden</small>
              <h3>#{{ o.id }}</h3>
            </div>
            <div>
              <small>Fecha</small
              ><span>{{
                o.createdAt ? (o.createdAt | date: "dd/MM/yyyy") : "—"
              }}</span>
            </div>
            <div>
              <small>Estado</small><span class="status">{{ o.estado }}</span>
            </div>
            <div>
              <small>Total</small
              ><strong>{{
                o.total | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
              }}</strong>
            </div>
            <b>→</b></a
          >
        }
      </div>
    }`,
})
export class MyOrdersComponent implements OnInit {
  private api = inject(OrdersService);
  orders: Order[] = [];
  loading = true;
  error = "";
  ngOnInit() {
    this.api.list().subscribe({
      next: (r) => {
        this.orders = r.content;
        this.loading = false;
      },
      error: (e) => {
        this.error = friendlyError(e);
        this.loading = false;
      },
    });
  }
}
