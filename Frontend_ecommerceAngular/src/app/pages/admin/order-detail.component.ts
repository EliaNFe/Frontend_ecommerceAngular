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
  imports: [CommonModule, RouterLink],
  template: `@if (loading) {
      <div class="state">Cargando orden…</div>
    } @else if (error || !o) {
      <div class="state error">{{ error }}</div>
    } @else {
      <section class="admin-form-page order-admin-detail">
        <a routerLink="/admin/ordenes" class="back">← Órdenes</a>
        <div class="detail-title">
          <div>
            <p class="eyebrow">Orden #{{ o.id }}</p>
            <h1>{{ o.estado }}</h1>
          </div>
          <strong>{{
            o.total | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
          }}</strong>
        </div>
        <dl>
          <div>
            <dt>Cliente</dt>
            <dd>{{ o.userEmail }}</dd>
          </div>
          <div>
            <dt>Fecha</dt>
            <dd>
              {{
                o.createdAt
                  ? (o.createdAt | date: "dd/MM/yyyy · HH:mm")
                  : "No disponible"
              }}
            </dd>
          </div>
          <div>
            <dt>Productos</dt>
            <dd>{{ o.items.length }}</dd>
          </div>
        </dl>
        <div class="item-list">
          @for (i of o.items; track i.productId) {
            <div>
              <div>
                <h3>{{ i.productNombre || "Producto #" + i.productId }}</h3>
                <p>
                  Cantidad: {{ i.cantidad }} · Unitario:
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
export class AdminOrderDetailComponent implements OnInit {
  private api = inject(OrdersService);
  private route = inject(ActivatedRoute);
  o?: Order;
  loading = true;
  error = "";
  ngOnInit() {
    this.api
      .adminGet(Number(this.route.snapshot.paramMap.get("id")))
      .subscribe({
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
