import { Injectable, signal } from "@angular/core";

export interface ToastMsg {
  id: number;
  text: string;
  kind: "ok" | "warn" | "err";
}

@Injectable({ providedIn: "root" })
export class ToastService {
  toasts = signal<ToastMsg[]>([]);
  private nextId = 0;

  show(text: string, kind: ToastMsg["kind"] = "ok"): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, text, kind }]);
    setTimeout(() => this.dismiss(id), 4200);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
