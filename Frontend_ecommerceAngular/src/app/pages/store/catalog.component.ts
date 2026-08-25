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
  template: `<section class="page-head">
      <p class="eyebrow">Colección</p>
      <h1>Catálogo</h1>
      <p>Encontrá eso que suma sin ocupar de más.</p>
    </section>
    <section class="catalog-layout">
      <aside class="filters">
        <label
          >Buscar<input
            [(ngModel)]="q"
            (keyup.enter)="load(0)"
            placeholder="¿Qué estás buscando?" /></label
        ><label
          >Categoría<input
            [(ngModel)]="categoria"
            (keyup.enter)="load(0)"
            placeholder="Todas" /></label
        ><button class="btn btn-primary" (click)="load(0)">
          Aplicar filtros</button
        ><button class="link-btn" (click)="clear()">Limpiar</button>
      </aside>
      <div>
        @if (loading) {
          <div class="state">Buscando productos…</div>
        } @else if (error) {
          <div class="state error">
            {{ error }}
            <button class="link-btn" (click)="load(page)">Reintentar</button>
          </div>
        } @else if (!products.length) {
          <div class="state">No encontramos productos con estos filtros.</div>
        } @else {
          <div class="product-grid">
            @for (p of products; track p.id) {
              <article class="product-tile">
                <a [routerLink]="['/producto', p.id]"
                  ><div class="product-photo">
                    <img
                      [src]="p.imagenUrl || placeholder"
                      [alt]="p.nombre"
                      (error)="img($event)"
                    />
                  </div>
                  <small>{{ p.categoria }}</small>
                  <h3>{{ p.nombre }}</h3></a
                >
                <div class="product-bottom">
                  <strong>{{
                    p.precio
                      | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
                  }}</strong
                  ><button [disabled]="!p.stock" (click)="add(p)">
                    {{ p.stock ? "Agregar" : "Sin stock" }}
                  </button>
                </div>
              </article>
            }
          </div>
          <div class="pager">
            <button [disabled]="page === 0" (click)="load(page - 1)">
              ← Anterior</button
            ><span>{{ page + 1 }} / {{ pages }}</span
            ><button [disabled]="page + 1 >= pages" (click)="load(page + 1)">
              Siguiente →
            </button>
          </div>
        }
      </div>
    </section>`,
})
export class CatalogComponent implements OnInit {
  private api = inject(ProductsService);
  private cart = inject(CartService);
  private toast = inject(ToastService);
  products: Product[] = [];
  q = "";
  categoria = "";
  page = 0;
  pages = 1;
  loading = true;
  error = "";
  placeholder = "assets/product-placeholder.svg";
  ngOnInit() {
    this.load(0);
  }
  load(page: number) {
    this.loading = true;
    this.error = "";
    this.api
      .list({
        categoria: this.categoria,
        page,
        size: 12,
        sort: "createdAt,desc",
      })
      .subscribe({
        next: (r) => {
          this.products = r.content.filter(
            (p) =>
              p.activo &&
              (!this.q ||
                p.nombre.toLowerCase().includes(this.q.toLowerCase())),
          );
          this.page = r.number;
          this.pages = r.totalPages || 1;
          this.loading = false;
        },
        error: (e) => {
          this.error = friendlyError(e);
          this.loading = false;
        },
      });
  }
  clear() {
    this.q = "";
    this.categoria = "";
    this.load(0);
  }
  add(p: Product) {
    this.cart.add(p);
    this.toast.show(`${p.nombre} se agregó a tu bolsa.`, "ok");
  }
  img(e: Event) {
    (e.target as HTMLImageElement).src = this.placeholder;
  }
}
