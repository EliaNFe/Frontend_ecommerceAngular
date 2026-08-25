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
  imports: [RouterLink],
  template: `<header class="admin-head">
      <div>
        <p class="eyebrow">Administración</p>
        <h1>Resumen</h1>
      </div>
    </header>
    <section class="admin-intro">
      <a routerLink="/admin/productos"
        ><span>01</span>
        <div>
          <h2>Productos</h2>
          <p>Catálogo, precios y stock</p>
        </div>
        <b>→</b></a
      ><a routerLink="/admin/ordenes"
        ><span>02</span>
        <div>
          <h2>Órdenes</h2>
          <p>Ventas y detalle</p>
        </div>
        <b>→</b></a
      ><a routerLink="/admin/clientes"
        ><span>03</span>
        <div>
          <h2>Clientes</h2>
          <p>Usuarios registrados</p>
        </div>
        <b>→</b></a
      >
    </section>`,
})
export class AdminDashboardComponent {}
