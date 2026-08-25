import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
export const authGuard: CanActivateFn = (_, s) => {
  const a = inject(AuthService),
    r = inject(Router);
  return (
    a.loggedIn() ||
    r.createUrlTree(["/login"], { queryParams: { returnUrl: s.url } })
  );
};
export const adminGuard: CanActivateFn = () => {
  const a = inject(AuthService),
    r = inject(Router);
  return (
    (a.loggedIn() && a.isAdmin()) ||
    r.createUrlTree(a.loggedIn() ? ["/cuenta"] : ["/login"])
  );
};
export const guestGuard: CanActivateFn = () => {
  const a = inject(AuthService),
    r = inject(Router);
  return !a.loggedIn() || r.createUrlTree([a.isAdmin() ? "/admin" : "/cuenta"]);
};
