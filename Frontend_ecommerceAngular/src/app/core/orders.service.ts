import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Order, Page } from "./models";
@Injectable({ providedIn: "root" })
export class OrdersService {
  private base = `${environment.apiUrl}/orders`;
  constructor(private http: HttpClient) {}
  create(items: { productId: number; cantidad: number }[]) {
    return this.http.post<Order>(this.base, { items });
  }
  list(page = 0, size = 10) {
    return this.http.get<Page<Order>>(this.base, { params: { page, size } });
  }
  get(id: number) {
    return this.http.get<Order>(`${this.base}/${id}`);
  }
  adminList(q = "", estado = "", page = 0, size = 15) {
    let p = new HttpParams().set("page", page).set("size", size);
    if (q) p = p.set("q", q);
    if (estado) p = p.set("estado", estado);
    return this.http.get<Page<Order>>(`${this.base}/admin`, { params: p });
  }
  adminGet(id: number) {
    return this.http.get<Order>(`${this.base}/admin/${id}`);
  }
}
