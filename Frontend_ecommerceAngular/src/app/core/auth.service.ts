import { Injectable, computed, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { JwtClaims, User } from "./models";
const KEY = "sotobosque_token";
@Injectable({ providedIn: "root" })
export class AuthService {
  readonly token = signal<string | null>(localStorage.getItem(KEY));
  readonly claims = computed(() => this.decode(this.token()));
  readonly loggedIn = computed(() => !!this.token() && !this.expired());
  readonly isAdmin = computed(() => this.claims()?.role === "ADMIN");
  readonly email = computed(() => this.claims()?.sub || "");
  constructor(private http: HttpClient) {
    if (this.expired()) this.logout();
  }
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{
        token: string;
      }>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((r) => this.save(r.token)));
  }
  register(v: {
    nombre: string;
    email: string;
    password: string;
  }): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, v);
  }
  logout() {
    localStorage.removeItem(KEY);
    this.token.set(null);
  }
  expired() {
    const e = this.claims()?.exp;
    return !!e && Date.now() >= e * 1000;
  }
  private save(t: string) {
    localStorage.setItem(KEY, t);
    this.token.set(t);
  }
  private decode(t: string | null): JwtClaims | null {
    try {
      if (!t) return null;
      const p = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(p));
    } catch {
      return null;
    }
  }
}
