import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Page, Product, ProductCreate, ProductUpdate } from "./models";
@Injectable({ providedIn: "root" })
export class ProductsService {
  private base = `${environment.apiUrl}/products`;
  constructor(private http: HttpClient) {}
  list(
    v: Record<string, string | number | boolean | undefined> = {},
  ): Observable<Page<Product>> {
    return this.http.get<Page<Product>>(this.base, { params: this.params(v) });
  }
  get(id: number) {
    return this.http.get<Product>(`${this.base}/${id}`);
  }
  adminList(v: Record<string, string | number | boolean | undefined>) {
    return this.http.get<Page<Product>>(`${this.base}/admin`, {
      params: this.params(v),
    });
  }
  adminGet(id: number) {
    return this.http.get<Product>(`${this.base}/admin/${id}`);
  }
  create(v: ProductCreate) {
    return this.http.post<Product>(this.base, v);
  }
  update(id: number, v: ProductUpdate) {
    return this.http.put<Product>(`${this.base}/${id}`, v);
  }
  setActive(id: number, activo: boolean) {
    return this.http.patch<Product>(`${this.base}/${id}/estado`, { activo });
  }
  addStock(id: number, cantidad: number) {
    return this.http.patch<Product>(`${this.base}/${id}/stock/agregar`, {
      cantidad,
    });
  }
  removeStock(id: number, cantidad: number) {
    return this.http.patch<Product>(`${this.base}/${id}/stock`, { cantidad });
  }
  private params(v: Record<string, string | number | boolean | undefined>) {
    let p = new HttpParams();
    Object.entries(v).forEach(([k, x]) => {
      if (x !== undefined && x !== "") p = p.set(k, String(x));
    });
    return p;
  }
}
