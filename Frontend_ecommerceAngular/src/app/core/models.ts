export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
export interface Product {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  categoria: string;
  imagenUrl?: string | null;
  activo: boolean;
  createdAt?: string;
}
export interface ProductCreate {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagenUrl: string;
}
export type ProductUpdate = Omit<ProductCreate, "stock">;
export interface OrderItem {
  productId: number;
  productNombre?: string | null;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
export interface Order {
  id: number;
  userEmail: string;
  estado: string;
  total: number;
  createdAt?: string;
  items: OrderItem[];
}
export interface User {
  id: number;
  email: string;
  nombre: string;
  role: string;
  createdAt?: string;
}
export interface CartItem {
  product: Product;
  cantidad: number;
}
export interface JwtClaims {
  sub?: string;
  role?: string;
  exp?: number;
}
