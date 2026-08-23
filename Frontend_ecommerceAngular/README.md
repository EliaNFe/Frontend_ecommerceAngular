# Sotobosque Ecommerce

Frontend desarrollado con Angular 18 para la tienda online y el panel de administración de Sotobosque. Permite consultar productos, gestionar el carrito, realizar pedidos y administrar productos, stock, órdenes y clientes.

Este repositorio contiene solamente el frontend. Para utilizar todas sus funciones también deben estar ejecutándose los microservicios del backend y su API Gateway.

## Requisitos

- Node.js y npm instalados.
- API Gateway disponible en `http://localhost:8080`.

La URL del backend se configura mediante `apiUrl` en `src/environments/environment.ts`. Si el Gateway utiliza otro host o puerto, debe modificarse ese valor.

## Instalación y ejecución

Desde la carpeta del proyecto, instalar las dependencias y levantar el servidor de desarrollo:

```bash
npm install
npm start
```

El sitio queda disponible normalmente en `http://localhost:4200` y se recarga automáticamente al detectar cambios.

Para generar una compilación optimizada para producción:

```bash
npm run build
```

El resultado se guarda en la carpeta `dist/`.

## Áreas de la aplicación

### Sitio público

Incluye la página de inicio, el catálogo y el detalle de productos, además del inicio de sesión y registro. El carrito puede utilizarse antes de iniciar sesión y se conserva localmente en el navegador.

### Área del cliente

El checkout, la cuenta y el historial de órdenes requieren una sesión válida. El cliente puede confirmar su carrito y consultar tanto el listado como el detalle de sus compras.

### Panel de administración

La ruta `/admin` está reservada para usuarios con rol `ADMIN`. Permite crear y editar productos, activar o desactivar su publicación, modificar el stock, revisar órdenes y consultar clientes.

## Autenticación

El inicio de sesión devuelve un token JWT que se almacena en el navegador. Un interceptor lo agrega automáticamente a las solicitudes enviadas al API Gateway. Si el token vence, la aplicación cierra la sesión y redirige al formulario de acceso.

Los guards restringen las páginas privadas y administrativas según la sesión y el rol del usuario. La autorización definitiva también debe validarse en el backend.

## Comunicación con el backend

Todo el tráfico HTTP se envía al API Gateway. Los contratos se tomaron de los DTOs y controllers reales de `UserService`, `CatalogService` y `OrderService`.

`PaymentService` no se consume directamente desde Angular: al enviar `POST /orders`, el backend ejecuta internamente el flujo necesario para crear y procesar la orden.

El catálogo público actualmente sólo admite `categoria` y paginación. No expone búsqueda mediante `q` ni un listado de categorías, por lo que la búsqueda pública se aplica únicamente sobre los productos de la página ya cargada. Los filtros completos sí están disponibles en `/products/admin`.

## Estructura principal

- `src/app/pages/store`: páginas públicas y del cliente.
- `src/app/pages/auth`: inicio de sesión y registro.
- `src/app/pages/admin`: panel y herramientas administrativas.
- `src/app/core`: servicios HTTP, autenticación, guards, interceptor, carrito y modelos.
- `src/app/shared`: componentes visuales reutilizables.
- `src/environments`: configuración del API Gateway.
