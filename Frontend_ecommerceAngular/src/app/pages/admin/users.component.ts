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
  imports: [CommonModule],
  template: `<header class="admin-head">
      <p class="eyebrow">Comunidad</p>
      <h1>Clientes</h1>
      <p>{{ total }} usuarios registrados</p>
    </header>
    @if (loading) {
      <div class="state">Cargando clientes…</div>
    } @else if (error) {
      <div class="state error">{{ error }}</div>
    } @else if (!users.length) {
      <div class="state">Todavía no hay clientes registrados.</div>
    } @else {
      <div class="admin-table user-table">
        <div class="tr th">
          <span>Nombre</span><span>Email</span><span>Alta</span><span>Rol</span>
        </div>
        @for (u of users; track u.id) {
          <div class="tr">
            <b>{{ u.nombre }}</b
            ><span>{{ u.email }}</span
            ><span>{{
              u.createdAt ? (u.createdAt | date: "dd/MM/yyyy") : "—"
            }}</span
            ><span
              ><i class="pill">{{ u.role }}</i></span
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
export class AdminUsersComponent implements OnInit {
  private api = inject(UsersService);
  users: User[] = [];
  page = 0;
  pages = 1;
  total = 0;
  loading = true;
  error = "";
  ngOnInit() {
    this.load(0);
  }
  load(p: number) {
    this.loading = true;
    this.api.list(p).subscribe({
      next: (r) => {
        this.users = r.content;
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
}
