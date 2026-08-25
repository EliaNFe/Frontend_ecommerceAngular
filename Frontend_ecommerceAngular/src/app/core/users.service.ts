import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Page, User } from "./models";
@Injectable({ providedIn: "root" })
export class UsersService {
  private base = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}
  list(page = 0, size = 15) {
    return this.http.get<Page<User>>(this.base, { params: { page, size } });
  }
  get(id: number) {
    return this.http.get<User>(`${this.base}/${id}`);
  }
}
