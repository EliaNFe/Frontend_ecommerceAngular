import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/auth.service";
import { friendlyError } from "../../core/http-error";
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `<main class="auth-page">
    <a class="wordmark auth-brand" routerLink="/">✦ Sotobosque</a>
    <section class="auth-visual register-art">
      <div>
        <p class="eyebrow">Bienvenido</p>
        <blockquote>Tu próxima elección empieza acá.</blockquote>
      </div>
    </section>
    <section class="auth-form">
      <div>
        <p class="eyebrow">Crear cuenta</p>
        <h1>Empecemos</h1>
        <p class="muted">
          Completá tus datos para comprar y seguir tus órdenes.
        </p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <label
            >Nombre<input formControlName="nombre" autocomplete="name" /></label
          ><label
            >Email<input
              type="email"
              formControlName="email"
              autocomplete="email" /></label
          ><label
            >Contraseña<input
              type="password"
              formControlName="password"
              autocomplete="new-password"
            /><small>Mínimo 8 caracteres.</small></label
          ><label
            >Confirmar contraseña<input
              type="password"
              formControlName="confirm"
              autocomplete="new-password"
          /></label>
          @if (error) {
            <p class="form-error">{{ error }}</p>
          }
          <button
            class="btn btn-primary wide"
            [disabled]="form.invalid || loading"
          >
            {{ loading ? "Creando cuenta…" : "Crear cuenta" }}
          </button>
        </form>
        <p class="auth-switch">
          ¿Ya tenés cuenta? <a routerLink="/login">Iniciar sesión</a>
        </p>
      </div>
    </section>
  </main>`,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  form = this.fb.nonNullable.group({
    nombre: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    confirm: ["", Validators.required],
  });
  loading = false;
  error = "";
  submit() {
    if (this.form.invalid) return;
    if (this.form.value.password !== this.form.value.confirm) {
      this.error = "Las contraseñas no coinciden.";
      return;
    }
    this.loading = true;
    const { nombre, email, password } = this.form.getRawValue();
    this.auth.register({ nombre, email, password }).subscribe({
      next: () =>
        this.router.navigate(["/login"], { queryParams: { registered: "1" } }),
      error: (e) => {
        this.error = friendlyError(e, "No pudimos crear tu cuenta.");
        this.loading = false;
      },
    });
  }
}
