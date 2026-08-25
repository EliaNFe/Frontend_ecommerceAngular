import { HttpErrorResponse } from "@angular/common/http";
export function friendlyError(
  e: unknown,
  f = "No pudimos completar la operación.",
) {
  const x = e as HttpErrorResponse,
    b = x?.error?.message || x?.error?.error;
  if (typeof b === "string" && b.length < 180) return b;
  if (x?.status === 0) return "No pudimos conectar con el servidor.";
  if (x?.status === 400) return "Revisá los datos ingresados.";
  if (x?.status === 401) return "Revisá tus credenciales.";
  if (x?.status === 403) return "No tenés permisos para acceder.";
  if (x?.status === 404) return "No encontramos lo que buscabas.";
  if (x?.status === 409)
    return "La operación entra en conflicto con el estado actual.";
  if (x?.status >= 500)
    return "El servidor tuvo un problema. Intentá nuevamente.";
  return f;
}
