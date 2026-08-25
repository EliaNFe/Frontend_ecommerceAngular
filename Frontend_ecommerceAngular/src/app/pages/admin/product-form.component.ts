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
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `<section class="admin-form-page">
    <a routerLink="/admin/productos" class="back">← Productos</a>
    <p class="eyebrow">{{ editing ? "Editar" : "Nuevo" }} producto</p>
    <h1>{{ editing ? "Editar producto" : "Crear producto" }}</h1>
    @if (loading) {
      <div class="state">Cargando…</div>
    } @else {
      <form [formGroup]="form" (ngSubmit)="save()" class="product-form">
        <div class="form-fields">
          <label>Nombre<input formControlName="nombre" /></label
          ><label>Categoría<input formControlName="categoria" /></label
          ><label
            >Descripción<textarea
              formControlName="descripcion"
              rows="5"
            ></textarea></label
          ><label
            >Precio<input
              type="number"
              min="0.01"
              step="0.01"
              formControlName="precio"
          /></label>
          @if (!editing) {
            <label
              >Stock inicial<input
                type="number"
                min="0"
                formControlName="stock"
            /></label>
          }
          <label
            >URL de imagen<input
              formControlName="imagenUrl"
              placeholder="https://…"
          /></label>
          @if (error) {
            <p class="form-error">{{ error }}</p>
          }
          <button class="btn btn-primary" [disabled]="form.invalid || saving">
            {{ saving ? "Guardando…" : "Guardar producto" }}
          </button>
        </div>
        <aside class="image-preview">
          <p class="eyebrow">Vista previa</p>
          <img
            [src]="form.value.imagenUrl || placeholder"
            (error)="img($event)"
          />
          <h3>{{ form.value.nombre || "Nombre del producto" }}</h3>
        </aside>
      </form>
    }
  </section>`,
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  id = Number(this.route.snapshot.paramMap.get("id"));
  editing = !!this.id;
  loading = this.editing;
  saving = false;
  error = "";
  placeholder = "assets/product-placeholder.svg";
  form = this.fb.nonNullable.group({
    nombre: ["", Validators.required],
    categoria: ["", Validators.required],
    descripcion: [""],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    imagenUrl: [""],
  });
  ngOnInit() {
    if (this.editing)
      this.api.adminGet(this.id).subscribe({
        next: (p) => {
          this.form.patchValue(p as any);
          this.loading = false;
        },
        error: (e) => {
          this.error = friendlyError(e);
          this.loading = false;
        },
      });
  }
  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.getRawValue(),
      req = this.editing
        ? this.api.update(this.id, {
            nombre: v.nombre,
            categoria: v.categoria,
            descripcion: v.descripcion,
            precio: v.precio,
            imagenUrl: v.imagenUrl,
          })
        : this.api.create(v);
    req.subscribe({
      next: () => {
        this.toast.show("Producto guardado.", "ok");
        this.router.navigateByUrl("/admin/productos");
      },
      error: (e) => {
        this.error = friendlyError(e);
        this.saving = false;
      },
    });
  }
  img(e: Event) {
    (e.target as HTMLImageElement).src = this.placeholder;
  }
}
