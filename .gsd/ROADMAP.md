# Saori SO - Roadmap de Desarrollo

**Versión**: 0.1.0  
**Última actualización**: 2026-01-21  
**Timeline total**: 6 semanas (30 días hábiles)

---

## Milestone 1: Fundación (Semana 1-2)

**Objetivo**: Infraestructura técnica lista para desarrollo

**Status**: Not Started  
**Fechas estimadas**: Día 1-10  
**Esfuerzo**: ~40 horas

---

### Phase 1.1: Setup del Proyecto

**Tareas**:

- [x] Inicializar repositorio Git
- [x] Configurar estructura monorepo
- [x] Clonar Dolibarr como referencia
- [x] Crear archivos GSD (SPEC, ROADMAP, STATE, etc.)
- [ ] Crear README.md principal
- [ ] Configurar .gitignore
- [ ] Definir LICENSE (MIT sugerido)
- [ ] Setup de workspace npm (package.json root)

**Criterios de verificación**:
- Estructura de carpetas coincide con SPEC.md
- `npm install` funciona en la raíz
- Git tiene commit inicial

---

### Phase 1.2: Base de Datos Local

**Tareas**:

- [ ] Crear `docker-compose.yml` para PostgreSQL
- [ ] Configurar variables de entorno (.env.example)
- [ ] Instalar Prisma en `apps/api`
- [ ] Crear schema.prisma inicial con tablas:
  - `User` (id, email, password_hash, role, created_at)
  - `Product` (id, name, sku, category_id, price_buy, price_sell, stock, stock_min, created_at)
  - `Category` (id, name, parent_id)
  - `Customer` (id, name, email, phone, rfc, created_at)
  - `Sale` (id, customer_id, user_id, total, payment_method, created_at)
  - `SaleItem` (id, sale_id, product_id, quantity, unit_price)
- [ ] Ejecutar primera migración: `npx prisma migrate dev`
- [ ] Verificar conexión a DB: `npx prisma studio`

**Criterios de verificación**:
- `docker-compose up` levanta PostgreSQL
- Prisma Studio muestra todas las tablas vacías
- Screenshot de Prisma Studio funcionando

---

### Phase 1.3: Backend API (Fastify)

**Tareas**:

- [ ] Inicializar proyecto Node.js en `apps/api`
- [ ] Instalar dependencias:
  ```json
  {
    "fastify": "^4.x",
    "@fastify/cors": "^8.x",
    "@fastify/jwt": "^7.x",
    "@fastify/env": "^4.x",
    "@prisma/client": "^5.x",
    "zod": "^3.x",
    "bcrypt": "^5.x"
  }
  ```
- [ ] Crear `src/server.js` con configuración básica
- [ ] Implementar plugin de Prisma
- [ ] Implementar plugin de JWT
- [ ] Crear ruta de health check: `GET /api/health`
- [ ] Configurar CORS para desarrollo
- [ ] Script de inicio: `npm run dev` (con nodemon)

**Criterios de verificación**:
- `curl http://localhost:3000/api/health` retorna `{"status": "ok"}`
- Logs muestran "Server listening on port 3000"
- Hot reload funciona al cambiar archivos

---

### Phase 1.4: Autenticación

**Tareas**:

- [ ] Crear schema Zod para login:
  ```ts
  { email: string, password: string }
  ```
- [ ] Ruta POST /api/auth/login
  - Validar credenciales contra DB
  - Generar JWT con payload: `{userId, email, role}`
  - Retornar: `{token, user: {id, email, role}}`
- [ ] Ruta POST /api/auth/register (admin solo)
  - Hashear password con bcrypt
  - Crear usuario en DB
- [ ] Script de seed: crear usuario inicial
  ```
  email: admin@saori.local
  password: admin123
  role: admin
  ```
- [ ] Middleware de autenticación: `verifyJWT`

**Criterios de verificación**:
- Seed crea usuario admin
- Login con credenciales correctas retorna token
- Login con credenciales incorrectas retorna 401
- Endpoint protegido sin token retorna 401
- Screenshot de Postman/Insomnia mostrando login exitoso

---

### Phase 1.5: Frontend Base (Svelte)

**Tareas**:

- [x] Crear proyecto SvelteKit en `apps/web`:
  ```bash
  npm create svelte@latest apps/web
  ```
- [x] Instalar Tailwind CSS:
  ```bash
  npx svelte-add@latest tailwindcss
  ```
- [x] Configurar `tailwind.config.js` con:
  - Colores del sistema de diseño
  - Fuente Manrope
- [x] Crear `src/app.html` personalizado (basado en code.html)
- [x] Crear `src/routes/+layout.svelte` con:
  - Sidebar de navegación
  - Header con logo y usuario
  - Área de contenido
- [x] Instalar Material Symbols:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
  ```
- [x] Crear componentes base:
  - `lib/components/ui/Button.svelte`
  - `lib/components/ui/Input.svelte`
  - `lib/components/ui/Card.svelte`

**Criterios de verificación**:
- `npm run dev` en apps/web levanta servidor
- Layout principal visible en http://localhost:5173
- Sidebar con links a: Dashboard, POS, Inventario, Clientes, Reportes, Configuración
- Screenshot comparando con code.html (debe ser similar)

---

### Phase 1.6: Integración Frontend-Backend

**Tareas**:

- [ ] Crear `lib/utils/api.js` con fetch wrapper
- [ ] Crear `lib/stores/auth.js` (Svelte store para autenticación)
  - `user` (datos del usuario)
  - `token` (JWT)
  - `isAuthenticated` (booleano)
  - `login(email, password)` (función)
  - `logout()` (función)
- [ ] Crear página de login: `src/routes/login/+page.svelte`
- [ ] Implementar lógica de login:
  - Form con email y password
  - Al submit, llamar a POST /api/auth/login
  - Guardar token en localStorage
  - Actualizar store de auth
  - Redirigir a dashboard
- [ ] Crear hook de autenticación: `src/hooks.server.js`
  - Proteger rutas (excepto /login)
  - Redirigir a /login si no autenticado

**Criterios de verificación**:
- Usuario puede hacer login con admin@saori.local
- Token se guarda en localStorage
- Después del login, usuario ve dashboard
- Logout limpia token y redirige a login
- Video/gif mostrando flujo completo de login

---

## Milestone 2: Módulos Core (Semana 3-4)

**Objetivo**: Funcionalidad crítica de negocio implementada

**Status**: Not Started  
**Fechas esti madas**: Día 11-20  
**Esfuerzo**: ~50 horas

---

### Phase 2.1: CRUD de Productos

**Tareas**:

- [ ] Backend - Rutas de productos:
  - GET /api/products (listar, con filtros y paginación)
  - GET /api/products/:id (obtener uno)
  - POST /api/products (crear)
  - PUT /api/products/:id (actualizar)
  - DELETE /api/products/:id (eliminar)
- [ ] Backend - Schemas Zod para validación
- [ ] Backend - Service layer: `ProductService`
- [ ] Frontend - Página: `src/routes/inventory/+page.svelte`
  - Tabla de productos con columnas: SKU, Nombre, Categoría, Stock, Precio
  - Botón "Nuevo Producto"
  - Búsqueda por nombre/SKU
  - Botones de editar/eliminar
- [ ] Frontend - Modal de crear/editar producto
- [ ] Frontend - Validación de formularios

**Criterios de verificación**:
- Crear 10 productos de prueba vía UI
- Editar un producto y ver cambios reflejados
- Eliminar un producto (con confirmación)
- Filtrar productos por nombre
- Screenshot de tabla de productos

---

### Phase 2.2: Categorías de Productos

**Tareas**:

- [ ] Backend - Rutas de categorías (CRUD básico)
- [ ] Frontend - Selector de categoría en form de producto
- [ ] Frontend - Posibilidad de crear categoría on-the-fly
- [ ] Seed inicial de categorías:
  - Bebidas → Refrescos, Cervezas, Jugos
  - Alimentos → Snacks, Dulces, Comida
  - Abarrotes → Granos, Enlatados, Limpieza

**Criterios de verificación**:
- Listar categorías en dropdown
- Filtrar productos por categoría
- Ver conteo de productos por categoría

---

### Phase 2.3: CRUD de Clientes

**Tareas**:

- [ ] Backend - Rutas de clientes (igual que productos)
- [ ] Frontend - Página: `src/routes/customers/+page.svelte`
  - Tabla con: Nombre, Teléfono, Email, Total Gastado, Última Compra
  - Form de crear/editar cliente
  - Validación de RFC (formato mexicano)
- [ ] Frontend - Vista de detalle del cliente:
  - Datos personales
  - Historial de compras (tabla)
  - Total gastado (lifetime value)

**Criterios de verificación**:
- Crear 5 clientes de prueba
- Ver historial vacío (aún no hay ventas)
- Screenshot de lista de clientes

---

### Phase 2.4: Punto de Venta (POS) - UI

**Tareas**:

- [ ] Frontend - Página: `src/routes/pos/+page.svelte`
- [ ] Layout de POS (referencia: code2.html):
  - Lado izquierdo (60%): Grid de productos
  - Lado derecho (40%): Carrito y totales
- [ ] Componentes:
  - `POSProductGrid.svelte` (grid de productos por categoría)
  - `POSCart.svelte` (carrito actual)
  - `POSPaymentModal.svelte` (modal de cobro)
- [ ] Funcionalidad:
  - Click en producto → agregar al carrito
  - Modificar cantidad en carrito
  - Eliminar item del carrito
  - Mostrar subtotal, impuestos (IVA 16%), total
- [ ] Atajos de teclado:
  - F1: Limpiar carrito (nuevo ticket)
  - F2: Buscar producto (modal)
  - F3: Abrir modal de pago
  - ESC: Cancelar/cerrar modal

**Criterios de verificación**:
- Productos se muestran en grid
- Agregar 3 productos diferentes al carrito
- Modificar cantidad de un producto
- Eliminar un producto del carrito
- Cálculo correcto de total con IVA
- Screenshot del POS con carrito lleno

---

### Phase 2.5: Punto de Venta (POS) - Cobro

**Tareas**:

- [ ] Backend - Ruta: POST /api/sales
  - Recibe: `{customerId?, items: [{productId, quantity}], paymentMethod, amountReceived?}`
  - Crea venta en DB
  - Crea SaleItems
  - Actualiza stock de productos (decrementar)
  - Retorna: `{saleId, total, change?}`
- [ ] Frontend - Modal de pago con tabs:
  - Tab "Efectivo": input de monto recibido, muestra cambio
  - Tab "Tarjeta": solo botón confirmar
  - Tab "Transferencia": solo botón confirmar
- [ ] Frontend - Después del cobro:
  - Mostrar ticket (modal o vista)
  - Opción de imprimir (por ahora solo preview)
  - Limpiar carrito automáticamente
- [ ] Manejo de errores:
  - Producto sin stock suficiente
  - Total $0
  - Monto recibido menor al total

**Criterios de verificación**:
- Realizar venta con efectivo, calcular cambio correcto
- Realizar venta con tarjeta
- Verificar en DB que venta se creó
- Verificar que stock de productos disminuyó
- Screenshot de ticket generado

---

### Phase 2.6: Corte de Caja

**Tareas**:

- [ ] Backend - Ruta: GET /api/sales/cash-closing
  - Parámetro: fecha (default: hoy)
  - Retorna:
    - Total ventas del día
    - Desglose por método de pago
    - Cantidad de transacciones
    - Detalle de cada venta
- [ ] Frontend - Página: `src/routes/cash-closing/+page.svelte`
  - Selector de fecha
  - Resumen de ventas
  - Tabla detallada
  - Botón "Imprimir Corte"

**Criterios de verificación**:
- Realizar 5 ventas (mixtas: efectivo y tarjeta)
- Ver corte de caja mostrando las 5 ventas
- Total coincide con suma manual
- Screenshot del corte de caja

---

## Milestone 3: Reportes (Semana 5)

**Objetivo**: Análisis de datos para toma de decisiones

**Status**: Not Started  
**Fechas estimadas**: Día 21-25  
**Esfuerzo**: ~20 horas

---

### Phase 3.1: Dashboard Principal

**Tareas**:

- [ ] Backend - Ruta: GET /api/dashboard/metrics
  - Retorna:
    - Ventas de hoy, ayer, semana, mes
    - Comparación con periodo anterior (%)
    - Top 5 productos más vendidos
    - Ventas por categoría (top 3)
    - Método de pago más usado
- [ ] Frontend - Página: `src/routes/+page.svelte` (dashboard)
  - Cards con métricas clave
  - Gráfica de ventas por día (últimos 7 días)
  - Tabla de top productos
- [ ] Instalar librería de gráficas: Chart.js o ApexCharts

**Criterios de verificación**:
- Dashboard muestra datos reales de ventas
- Gráfica renderiza correctamente
- Comparar con code.html (diseño similar)
- Screenshot del dashboard

---

### Phase 3.2: Reportes de Ventas

**Tareas**:

- [ ] Backend - Ruta: GET /api/reports/sales
  - Parámetros: startDate, endDate, groupBy (day/week/month)
  - Retorna: ventas agrupadas
- [ ] Frontend - Página: `src/routes/reports/+page.svelte`
  - Filtros: rango de fechas
  - Tabs: Por período, Por categoría, Por producto
  - Gráficas interactivas
  - Tabla de detalles

**Criterios de verificación**:
- Filtrar ventas por semana
- Ver breakdown por categoría
- Gráfica responde a filtros

---

### Phase 3.3: Exportación a Excel

**Tareas**:

- [ ] Backend - Instalar: `exceljs`
- [ ] Backend - Ruta: GET /api/reports/export
  - Genera archivo Excel con ventas
  - Headers: Fecha, Cliente, Productos, Total, Método Pago
- [ ] Frontend - Botón "Exportar a Excel" en reportes
  - Trigger download del archivo

**Criterios de verificación**:
- Exportar reporte de ventas
- Abrir Excel y verificar datos
- Screenshot del Excel generado

---

## Milestone 4: Pulido (Semana 6)

**Objetivo**: Producto listo para uso real

**Status**: Not Started  
**Fechas estimadas**: Día 26-30  
**Esfuerzo**: ~20 horas

---

### Phase 4.1: Dark Mode

**Tareas**:

- [ ] Configurar Tailwind dark mode: `class`
- [ ] Crear toggle de dark mode en header
- [ ] Guardar preferencia en localStorage
- [ ] Ajustar todos los componentes con variantes dark
- [ ] Probar contraste (WCAG AA mínimo)

**Criterios de verificación**:
- Toggle cambia tema instantáneamente
- Todos los textos son legibles en ambos modos
- Screenshot en dark mode

---

### Phase 4.2: Responsive Design

**Tareas**:

- [ ] Probar en resoluciones:
  - Tablet: 768px (mostrador)
  - Desktop: 1920px (oficina)
- [ ] Ajustar POS para tablets:
  - Grid de productos más grande
  - Botones táctiles (min 44px)
- [ ] Sidebar colapsable en tablets
- [ ] Tablas responsivas (scroll horizontal)

**Criterios de verificación**:
- POS usable en tablet 10"
- Dashboard legible en desktop 1080p
- Screenshots en ambas resoluciones

---

### Phase 4.3: Documentación

**Tareas**:

- [ ] README.md completo:
  - Descripción del proyecto
  - Requisitos del sistema
  - Instalación paso a paso
  - Comandos comunes
  - Stack tecnológico
  - Estructura de carpetas
  - Contribuir
- [ ] Manual de usuario (docs/USER_GUIDE.md):
  - Cómo hacer login
  - Cómo dar de alta productos
  - Cómo cobrar en el POS
  - Cómo ver reportes
- [ ] Comentarios en código (español)

**Criterios de verificación**:
- Persona externa puede instalar siguiendo README
- Manual de usuario explica funciones clave

---

### Phase 4.4: Testing Básico

**Tareas**:

- [ ] Smoke tests (Playwright o Cypress):
  - Login exitoso
  - Crear producto
  - Realizar venta
  - Ver dashboard
- [ ] Tests unitarios backend (Vitest):
  - Validaciones Zod
  - Cálculo de totales
  - Actualización de stock

**Criterios de verificación**:
- `npm test` pasa todos los tests
- Coverage mínimo 40%
- Screenshot de tests corriendo

---

### Phase 4.5: Optimización

**Tareas**:

- [ ] Lazy loading de rutas en SvelteKit
- [ ] Optimizar consultas Prisma (usar `select`, `include` apropiados)
- [ ] Agregar índices en DB (productos.sku, customers.rfc)
- [ ] Comprimir imágenes (si las hay)
- [ ] Audit de bundle size: `npm run build`

**Criterios de verificación**:
- Lighthouse Score > 90
- Bundle JS < 200KB
- Tiempo de carga < 2s

---

## Verification Checklist (General)

Después de cada fase:

- [ ] Código commitado con mensaje descriptivo
- [ ] STATE.md actualizado
- [ ] Feature probada manualmente
- [ ] Screenshot/video capturado (si aplica UI)
- [ ] Sin errores en consola del navegador
- [ ] Sin errores en logs del servidor

---

## Post-MVP (Futuro)

Funcionalidades para versiones posteriores:

- **v2.0**: Sincronización con Supabase
- **v2.1**: Multi-sucursal
- **v2.2**: Facturación electrónica (CFDI)
- **v2.3**: App móvil (React Native o PWA)
- **v2.4**: Empleados y roles avanzados
- **v2.5**: Compras a proveedores
- **v2.6**: Nómina básica

---

**Notas**:
- Este roadmap es flexible; se ajustará según descubrimientos durante desarrollo
- Cada fase debe marcarse como [x] al completarse
- Actualizar fechas reales al finalizar cada milestone
- Documentar desviaciones en JOURNAL.md

---

**Status**: DRAFT → Pendiente de validación por Luis  
**Una vez aprobado**: Cambiar a status ACTIVE
