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
  template: `<section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Sotobosque · Objetos</p>
        <h1>Casa,<br /><em>sin ruido.</em></h1>
        <a class="btn btn-primary" routerLink="/catalogo">Ver catálogo</a>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="sun"></div>
        <div class="leaf leaf-a"></div>
        <div class="leaf leaf-b"></div>
      </div>
    </section>
    <section class="home-products">
      <div class="section-title">
        <div>
          <p class="eyebrow">Novedades</p>
          <h2>Últimos ingresos</h2>
        </div>
        <a routerLink="/catalogo">Ver todo →</a>
      </div>
      @if (loading) {
        <div class="state">Cargando…</div>
      } @else if (products.length) {
        <div class="product-grid">
          @for (p of products; track p.id) {
            <a class="product-tile" [routerLink]="['/producto', p.id]"
              ><div class="product-photo">
                <img
                  [src]="p.imagenUrl || placeholder"
                  [alt]="p.nombre"
                  (error)="imageError($event)"
                />
              </div>
              <small>{{ p.categoria }}</small>
              <h3>{{ p.nombre }}</h3>
              <strong>{{
                p.precio | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
              }}</strong></a
            >
          }
        </div>
      } @else {
        <div class="state">Sin productos por ahora.</div>
      }
    </section>`,
})
export class HomeComponent implements OnInit {
  private api = inject(ProductsService);
  products: Product[] = [];
  loading = true;
  placeholder = "assets/product-placeholder.svg";
  ngOnInit() {
    this.api.list({ page: 0, size: 4, sort: "createdAt,desc" }).subscribe({
      next: (r) => {
        this.products = r.content.filter((p) => p.activo);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
  imageError(e: Event) {
    (e.target as HTMLImageElement).src = this.placeholder;
  }
}
