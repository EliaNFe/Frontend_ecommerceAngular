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
  template: `<header class="admin-head">
      <p class="eyebrow">Ventas</p>
      <h1>Órdenes</h1>
    </header>
    <section class="admin-filters orders">
      <input
        [(ngModel)]="q"
        (ngModelChange)="search$.next($event)"
        placeholder="Buscar por cliente o número de orden…"
      /><select [(ngModel)]="estado" (change)="load(0)">
        <option value="">Todos los estados</option>
        @for (s of states; track s) {
          <option [value]="s">{{ s }}</option>
        }
      </select>
    </section>
    @if (loading) {
      <div class="state">Cargando órdenes…</div>
    } @else if (error) {
      <div class="state error">{{ error }}</div>
    } @else if (!orders.length) {
      <div class="state">No hay órdenes que coincidan con la búsqueda.</div>
    } @else {
      <div class="admin-table order-table">
        <div class="tr th">
          <span>Orden</span><span>Cliente</span><span>Fecha</span
          ><span>Estado</span><span>Productos</span><span>Total</span
          ><span></span>
        </div>
        @for (o of orders; track o.id) {
          <div class="tr">
            <b>#{{ o.id }}</b
            ><span>{{ o.userEmail }}</span
            ><span>{{
              o.createdAt ? (o.createdAt | date: "dd/MM/yyyy") : "—"
            }}</span
            ><span
              ><i class="pill">{{ o.estado }}</i></span
            ><span>{{ o.items.length }}</span
            ><strong>{{
              o.total | currency: "ARS" : "symbol-narrow" : "1.2-2" : "es-AR"
            }}</strong
            ><a [routerLink]="['/admin/ordenes', o.id]">Ver detalle →</a>
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
export class AdminOrdersComponent implements OnInit, OnDestroy {
  private api = inject(OrdersService);
  private end$ = new Subject<void>();
  search$ = new Subject<string>();
  orders: Order[] = [];
  states: string[] = [];
  q = "";
  estado = "";
  page = 0;
  pages = 1;
  loading = true;
  error = "";
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
  load(p: number) {
    this.loading = true;
    this.api.adminList(this.q, this.estado, p).subscribe({
      next: (r) => {
        this.orders = r.content;
        this.states = [
          ...new Set([...this.states, ...r.content.map((o) => o.estado)]),
        ];
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
}
