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
  template: `<header class="admin-head row">
      <div>
        <p class="eyebrow">Catálogo</p>
        <h1>Productos</h1>
        <p>{{ total }} productos encontrados</p>
      </div>
      <a class="btn btn-primary" routerLink="/admin/productos/nuevo"
        >Nuevo producto</a
      >
    </header>
    <section class="admin-filters">
      <input
        [(ngModel)]="q"
        (ngModelChange)="search$.next($event)"
        placeholder="Buscar productos…"
      /><input
        [(ngModel)]="categoria"
        (ngModelChange)="search$.next(q)"
        placeholder="Categoría"
      /><select [(ngModel)]="activo" (change)="load(0)">
        <option value="">Todos los estados</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option></select
      ><select [(ngModel)]="stock" (change)="load(0)">
        <option value="">Todo el stock</option>
        <option value="available">Con stock</option>
        <option value="empty">Sin stock</option>
        <option value="low">Stock bajo</option>
      </select>
    </section>
    @if (loading) {
      <div class="state">Cargando productos…</div>
    } @else if (error) {
      <div class="state error">{{ error }}</div>
    } @else if (!products.length) {
      <div class="state">No encontramos productos con estos filtros.</div>
    } @else {
      <div class="admin-table product-table">
        <div class="tr th">
          <span>Producto</span><span>Estado</span><span>Stock</span
          ><span>Precio</span><span></span>
        </div>
        @for (p of products; track p.id) {
          <div class="tr">
            <span class="product-cell"
              ><img
                [src]="p.imagenUrl || placeholder"
                (error)="img($event)"
              /><span
                ><b>{{ p.nombre }}</b
                ><small>{{ p.categoria }}</small></span
              ></span
            ><span
              ><i class="pill" [class.off]="!p.activo">{{
                p.activo ? "Activo" : "Inactivo"
              }}</i></span
            ><span
              ><i
                class="stock-pill"
                [class.low]="p.stock <= 5"
                [class.empty]="p.stock === 0"
                >{{
                  p.stock === 0
                    ? "Sin stock"
                    : p.stock <= 5
                      ? p.stock + " · Bajo"
                      : p.stock
                }}</i
              ></span
            ><strong>{{
              p.precio | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
            }}</strong
            ><span class="actions"
              ><a [routerLink]="['/admin/productos', p.id, 'editar']">Editar</a
              ><a [routerLink]="['/admin/productos', p.id, 'stock']">Stock</a
              ><button (click)="toggle(p)">
                {{ p.activo ? "Desactivar" : "Activar" }}
              </button></span
            >
          </div>
        }
      </div>
      <div class="pager">
        <button [disabled]="page === 0" (click)="load(page - 1)">←</button
        ><span>Página {{ page + 1 }} de {{ pages }}</span
        ><button [disabled]="page + 1 >= pages" (click)="load(page + 1)">
          →
        </button>
      </div>
    }`,
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  private api = inject(ProductsService);
  private toast = inject(ToastService);
  private end$ = new Subject<void>();
  search$ = new Subject<string>();
  products: Product[] = [];
  q = "";
  categoria = "";
  activo = "";
  stock = "";
  page = 0;
  pages = 1;
  total = 0;
  loading = true;
  error = "";
  placeholder = "assets/product-placeholder.svg";
  ngOnInit() {
    this.search$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.end$))
      .subscribe(() => this.load(0));
    this.load(0);
  }
  ngOnDestroy() {
    this.end$.next();
    this.end$.complete();
  }
  load(page: number) {
    this.loading = true;
    const v: any = {
      q: this.q,
      categoria: this.categoria,
      activo: this.activo === "" ? undefined : this.activo,
      page,
      size: 15,
      sort: "createdAt,desc",
    };
    if (this.stock === "empty") v.sinStock = true;
    if (this.stock === "low") v.stockBajo = true;
    if (this.stock === "available") v.sinStock = false;
    this.api.adminList(v).subscribe({
      next: (r) => {
        this.products = r.content;
        this.page = r.number;
        this.pages = r.totalPages || 1;
        this.total = r.totalElements;
        this.loading = false;
      },
      error: (e) => {
        this.error = friendlyError(e);
        this.loading = false;
      },
    });
  }
  toggle(p: Product) {
    if (p.activo && !confirm(`¿Desactivar “${p.nombre}”?`)) return;
    this.api.setActive(p.id, !p.activo).subscribe({
      next: (x) => {
        Object.assign(p, x);
        this.toast.show(
          `Producto ${x.activo ? "activado" : "desactivado"}.`,
          "ok",
        );
      },
      error: (e) => this.toast.show(friendlyError(e), "err"),
    });
  }
  img(e: Event) {
    (e.target as HTMLImageElement).src = this.placeholder;
  }
}
