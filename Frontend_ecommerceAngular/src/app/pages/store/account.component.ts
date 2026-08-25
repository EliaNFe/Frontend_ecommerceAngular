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
  template: `<section class="account-head">
      <div>
        <p class="eyebrow">Tu espacio</p>
        <h1>Mi cuenta</h1>
        <p>{{ auth.email() }}</p>
      </div>
      <a class="btn btn-primary" routerLink="/cuenta/ordenes"
        >Ver mis órdenes</a
      >
    </section>
    <section class="account-links">
      <a routerLink="/cuenta/ordenes"
        ><span>01</span>
        <div>
          <h2>Mis órdenes</h2>
          <p>Consultá tus compras y el detalle de cada pedido.</p>
        </div>
        <b>→</b></a
      ><a routerLink="/catalogo"
        ><span>02</span>
        <div>
          <h2>Volver a la tienda</h2>
          <p>Seguí explorando nuestra colección.</p>
        </div>
        <b>→</b></a
      >
    </section>`,
})
export class AccountComponent {
  auth = inject(AuthService);
}
