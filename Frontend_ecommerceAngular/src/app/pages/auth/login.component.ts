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
    <section class="auth-visual">
      <div>
        <p class="eyebrow">Volver a lo esencial</p>
        <blockquote>Objetos con calma para espacios con vida.</blockquote>
      </div>
    </section>
    <section class="auth-form">
      <div>
        <p class="eyebrow">Tu cuenta</p>
        <h1>Iniciar sesión</h1>
        <p class="muted">Ingresá para continuar con tu compra.</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <label
            >Email<input
              type="email"
              formControlName="email"
              autocomplete="email" /></label
          ><label
            >Contraseña<input
              type="password"
              formControlName="password"
              autocomplete="current-password"
          /></label>
          @if (error) {
            <p class="form-error">{{ error }}</p>
          }
          <button
            class="btn btn-primary wide"
            [disabled]="form.invalid || loading"
          >
            {{ loading ? "Ingresando…" : "Iniciar sesión" }}
          </button>
        </form>
        <p class="auth-switch">
          ¿No tenés cuenta? <a routerLink="/registro">Crear cuenta</a>
        </p>
      </div>
    </section>
  </main>`,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });
  loading = false;
  error = "";
  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth
      .login(this.form.value.email!, this.form.value.password!)
      .subscribe({
        next: () =>
          this.router.navigateByUrl(
            this.route.snapshot.queryParamMap.get("returnUrl") ||
              (this.auth.isAdmin() ? "/admin" : "/cuenta"),
          ),
        error: (e) => {
          this.error = friendlyError(e, "No pudimos iniciar sesión.");
          this.loading = false;
        },
      });
  }
}
