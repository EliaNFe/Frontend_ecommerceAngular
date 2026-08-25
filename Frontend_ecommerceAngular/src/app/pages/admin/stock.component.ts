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
  imports: [CommonModule, FormsModule, RouterLink],
  template: `<section class="admin-form-page narrow-admin">
    <a routerLink="/admin/productos" class="back">← Productos</a>
    <p class="eyebrow">Inventario</p>
    <h1>Administrar stock</h1>
    @if (loading) {
      <div class="state">Cargando…</div>
    } @else if (p) {
      <div class="stock-panel">
        <div>
          <small>{{ p.categoria }}</small>
          <h2>{{ p.nombre }}</h2>
          <p>Stock actual</p>
          <strong>{{ p.stock }}</strong
          ><span class="stock-label">{{
            p.stock === 0
              ? "Sin stock"
              : p.stock <= 5
                ? "Stock bajo"
                : "Disponible"
          }}</span>
        </div>
        <div class="stock-action">
          <label
            >Cantidad<input type="number" min="1" [(ngModel)]="cantidad"
          /></label>
          <div>
            <button class="btn btn-primary" (click)="change(true)">Sumar</button
            ><button
              class="btn btn-ghost"
              [disabled]="cantidad > p.stock"
              (click)="change(false)"
            >
              Descontar
            </button>
          </div>
        </div>
      </div>
    }
  </section>`,
})
export class StockComponent implements OnInit {
  private api = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  p?: Product;
  cantidad = 1;
  loading = true;
  ngOnInit() {
    this.api
      .adminGet(Number(this.route.snapshot.paramMap.get("id")))
      .subscribe((p) => {
        this.p = p;
        this.loading = false;
      });
  }
  change(add: boolean) {
    if (!this.p || this.cantidad < 1) return;
    (add
      ? this.api.addStock(this.p.id, this.cantidad)
      : this.api.removeStock(this.p.id, this.cantidad)
    ).subscribe({
      next: (p) => {
        this.p = p;
        this.toast.show("Stock actualizado.", "ok");
      },
      error: (e) => this.toast.show(friendlyError(e), "err"),
    });
  }
}
