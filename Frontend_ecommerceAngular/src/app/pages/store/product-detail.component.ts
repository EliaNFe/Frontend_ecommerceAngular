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
  imports: [CommonModule, FormsModule, RouterLink],
  template: `@if (loading) {
      <div class="state tall">Cargando producto…</div>
    } @else if (error || !p) {
      <div class="state tall error">
        {{ error || "Producto no disponible." }}
        <a routerLink="/catalogo">Volver al catálogo</a>
      </div>
    } @else {
      <section class="product-detail">
        <div class="detail-photo">
          <img
            [src]="p.imagenUrl || placeholder"
            [alt]="p.nombre"
            (error)="img($event)"
          />
        </div>
        <div class="detail-copy">
          <a routerLink="/catalogo" class="back">← Catálogo</a>
          <p class="eyebrow">{{ p.categoria }}</p>
          <h1>{{ p.nombre }}</h1>
          <p class="price">
            {{
              p.precio | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
            }}
          </p>
          <div class="rule"></div>
          <p class="description">
            {{ p.descripcion || "Sin descripción disponible." }}
          </p>
          <p class="stock" [class.out]="p.stock === 0">
            {{
              p.stock === 0
                ? "Sin stock"
                : p.stock <= 5
                  ? "Quedan pocas unidades"
                  : "Disponible"
            }}
          </p>
          <div class="buy-row">
            <label
              >Cantidad<input
                type="number"
                min="1"
                [max]="p.stock"
                [(ngModel)]="qty" /></label
            ><button
              class="btn btn-primary"
              [disabled]="p.stock === 0"
              (click)="add()"
            >
              Agregar a la bolsa
            </button>
          </div>
        </div>
      </section>
    }`,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ProductsService);
  private cart = inject(CartService);
  private toast = inject(ToastService);
  p?: Product;
  qty = 1;
  loading = true;
  error = "";
  placeholder = "assets/product-placeholder.svg";
  ngOnInit() {
    this.api.get(Number(this.route.snapshot.paramMap.get("id"))).subscribe({
      next: (p) => {
        this.p = p;
        this.loading = false;
      },
      error: (e) => {
        this.error = friendlyError(e);
        this.loading = false;
      },
    });
  }
  add() {
    if (this.p) {
      this.cart.add(this.p, this.qty);
      this.toast.show("Producto agregado a tu bolsa.", "ok");
    }
  }
  img(e: Event) {
    (e.target as HTMLImageElement).src = this.placeholder;
  }
}
