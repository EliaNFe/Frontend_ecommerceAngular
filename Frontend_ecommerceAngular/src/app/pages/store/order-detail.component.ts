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
  template: `@if (loading) {
      <div class="state tall">Cargando detalle…</div>
    } @else if (error || !o) {
      <div class="state error">{{ error }}</div>
    } @else {
      <section class="narrow order-detail">
        <a routerLink="/cuenta/ordenes" class="back">← Mis órdenes</a>
        <p class="eyebrow">Orden #{{ o.id }}</p>
        <div class="detail-title">
          <h1>{{ o.estado }}</h1>
          <strong>{{
            o.total | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
          }}</strong>
        </div>
        <p>
          {{
            o.createdAt
              ? (o.createdAt | date: "dd/MM/yyyy · HH:mm")
              : "Fecha no disponible"
          }}
        </p>
        <div class="item-list">
          @for (i of o.items; track i.productId) {
            <div>
              <div>
                <h3>{{ i.productNombre || "Producto #" + i.productId }}</h3>
                <p>
                  Cantidad: {{ i.cantidad }} · Precio unitario:
                  {{
                    i.precioUnitario
                      | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
                  }}
                </p>
              </div>
              <strong>{{
                i.subtotal
                  | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
              }}</strong>
            </div>
          }
        </div>
      </section>
    }`,
})
export class ClientOrderDetailComponent implements OnInit {
  private api = inject(OrdersService);
  private route = inject(ActivatedRoute);
  o?: Order;
  loading = true;
  error = "";
  ngOnInit() {
    this.api.get(Number(this.route.snapshot.paramMap.get("id"))).subscribe({
      next: (o) => {
        this.o = o;
        this.loading = false;
      },
      error: (e) => {
        this.error = friendlyError(e);
        this.loading = false;
      },
    });
  }
}
