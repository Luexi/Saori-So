# Saori SO - Architecture

**Versión**: 0.1.0  
**Última actualización**: 2026-01-21  
**Status**: Initial Design

---

## System Overview

Saori SO es un sistema **monolítico modular** con arquitectura de 3 capas:

```
┌─────────────────────────────────────────────┐
│          Client Layer (Browser)             │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   Svelte SPA (apps/web)             │   │
│  │   - Components (UI)                 │   │
│  │   - Stores (State Management)       │   │
│  │   - Routes (SvelteKit)              │   │
│  │   - API Client (Fetch)              │   │
│  └──────────────┬──────────────────────┘   │
└─────────────────┼──────────────────────────┘
                  │ HTTP/REST + JSON
                  │ (CORS enabled in dev)
┌─────────────────▼──────────────────────────┐
│       Application Layer (Node.js)           │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   Fastify Server (apps/api)         │   │
│  │   ┌───────────────────────────┐     │   │
│  │   │  Routes (Controllers)     │     │   │
│  │   │  - /auth                  │     │   │
│  │   │  - /products              │     │   │
│  │   │  - /customers             │     │   │
│  │   │  - /sales                 │     │   │
│  │   │  - /reports               │     │   │
│  │   └────────┬──────────────────┘     │   │
│  │            │                         │   │
│  │   ┌────────▼──────────────────┐     │   │
│  │   │  Services (Business Logic) │     │   │
│  │   │  - ProductService         │     │   │
│  │   │  - SaleService            │     │   │
│  │   │  - ReportService          │     │   │
│  │   └────────┬──────────────────┘     │   │
│  │            │                         │   │
│  │   ┌────────▼──────────────────┐     │   │
│  │   │  Schemas (Validation)     │     │   │
│  │   │  - Zod schemas            │     │   │
│  │   └───────────────────────────┘     │   │
│  └──────────────┬──────────────────────┘   │
└─────────────────┼──────────────────────────┘
                  │ Prisma ORM
                  │ (Type-safe queries)
┌─────────────────▼──────────────────────────┐
│         Data Layer (PostgreSQL)             │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   PostgreSQL 15+                    │   │
│  │   (Docker container)                │   │
│  │   - users                           │   │
│  │   - products / categories           │   │
│  │   - customers                       │   │
│  │   - sales / sale_items              │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## Design Principles

### 1. Local-First Architecture

**Principio**: El sistema debe funcionar 100% sin conexión a internet.

**Implementación**:
- Base de datos local (PostgreSQL en Docker)
- Frontend SPA (no depende de SSR)
- Assets embebidos (sin CDN externo)
- Sincronización opcional (futura fase)

**Beneficios**:
- Funcionamiento en zonas con internet irregular
- Sin dependencia de servicios externos
- Latencia mínima (todo local)

---

### 2. Monolito Modular

**Por qué NO microservicios**:
- Equipo de 1 persona
- MVP en 30 días
- Hardware limitado del usuario
- No necesita escala masiva

**Estructura modular dentro del monolito**:

```
apps/api/src/
├── routes/           # HTTP endpoints
├── services/         # Business logic
├── schemas/          # Validation (Zod)
├── plugins/          # Fastify plugins
└── utils/            # Helpers
```

**Ventajas**:
- Desarrollo más rápido
- Deploy simple (single process)
- Debug más fácil
- Transacciones ACID garantizadas

**Plan de migración futuro**:
Si el proyecto crece, se pueden extraer módulos a servicios independientes (ejemplo: módulo de facturación electrónica).

---

### 3. RESTful API

**Convenciones**:

| Operación | Método | Ruta | Ejemplo |
|-----------|--------|------|---------|
| Listar | GET | /api/{resource} | GET /api/products |
| Obtener uno | GET | /api/{resource}/:id | GET /api/products/123 |
| Crear | POST | /api/{resource} | POST /api/products |
| Actualizar | PUT | /api/{resource}/:id | PUT /api/products/123 |
| Eliminar | DELETE | /api/{resource}/:id | DELETE /api/products/123 |

**Respuestas**:
```json
// Success (200/201)
{
  "data": {...},
  "message": "Producto creado exitosamente"
}

// Error (400/401/500)
{
  "error": "Mensaje de error",
  "details": {...}
}
```

---

### 4. Separation of Concerns

**Frontend (apps/web)**:
- Presentación
- Interacción del usuario
- Validación básica (UX)
- State management local

**Backend (apps/api)**:
- Lógica de negocio
- Validación definitiva (seguridad)
- Persistencia de datos
- Generación de reportes

**Database**:
- Datos estructurados
- Integridad referencial
- Índices para performance

---

## Data Model (Entities)

### Core Entities

```prisma
User
├── id (UUID)
├── email
├── password_hash
├── role (admin | cashier)
└── created_at

Product
├── id (UUID)
├── name
├── sku
├── category_id (FK → Category)
├── price_buy (decimal)
├── price_sell (decimal)
├── stock (integer)
├── stock_min (integer)
└── created_at

Category
├── id (UUID)
├── name
├── parent_id (FK → Category, nullable)
└── created_at

Customer
├── id (UUID)
├── name
├── email (nullable)
├── phone (nullable)
├── rfc (nullable)
└── created_at

Sale
├── id (UUID)
├── customer_id (FK → Customer, nullable)
├── user_id (FK → User)
├── total (decimal)
├── payment_method (cash | card | transfer)
├── amount_received (decimal, nullable)
└── created_at

SaleItem
├── id (UUID)
├── sale_id (FK → Sale)
├── product_id (FK → Product)
├── quantity (integer)
├── unit_price (decimal)
└── subtotal (decimal)
```

### Relationships

- `Category` → self-referencing (parent_id) para jerarquías
- `Product` → `Category` (many-to-one)
- `Sale` → `Customer` (many-to-one, optional)
- `Sale` → `User` (many-to-one)
- `SaleItem` → `Sale` (many-to-one)
- `SaleItem` → `Product` (many-to-one)

---

## Security Architecture

### Authentication

**Método**: JWT (JSON Web Tokens)

**Flujo**:
1. Usuario envía email + password a POST /api/auth/login
2. Backend valida credenciales contra DB
3. Si válido, genera JWT con payload:
   ```json
   {
     "userId": "uuid",
     "email": "user@example.com",
     "role": "admin",
     "iat": 1234567890,
     "exp": 1234654321
   }
   ```
4. Frontend guarda token en `localStorage`
5. Requests subsecuentes incluyen header: `Authorization: Bearer <token>`
6. Backend verifica token en cada request protegido

**Expiración**: 7 días (configurable)

### Authorization

**Roles**:

| Role | Puede acceder a |
|------|-----------------|
| `admin` | Todo el sistema (CRUD completo) |
| `cashier` | Solo POS y consulta de productos/clientes |

**Implementación**:
- Middleware: `verifyJWT` (valida token)
- Decorator: `requireRole(['admin'])` (valida rol)

---

## Performance Considerations

### Database Indexes

```sql
-- Optimizar búsquedas frecuentes
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_customers_rfc ON customers(rfc);
CREATE INDEX idx_sales_created ON sales(created_at DESC);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
```

### Frontend Optimizations

- **Code splitting**: Lazy load de rutas con SvelteKit
- **Pagination**: Listar productos de 50 en 50
- **Debouncing**: Búsquedas con delay de 300ms
- **Caching**: Productos en memoria (store) para POS

### Backend Optimizations

- **Connection pooling**: Prisma maneja pool automáticamente
- **Selective queries**: Solo traer campos necesarios
  ```js
  prisma.product.findMany({
    select: { id: true, name: true, stock: true }
  })
  ```

---

## Deployment Architecture (MVP)

**Modo desarrollo**:
```
Frontend: http://localhost:5173 (Vite dev server)
Backend:  http://localhost:3000 (Fastify)
DB:       localhost:5432 (Docker PostgreSQL)
```

**Modo producción (local)**:
```
Frontend: Archivos estáticos servidos por backend
Backend:  Single Fastify process (puerto 3000)
DB:       PostgreSQL en Docker o instalado localmente
```

**Comando de inicio**:
```bash
docker-compose up -d  # Levantar PostgreSQL
cd apps/api && npm run start  # Iniciar backend (sirve frontend también)
```

---

## Future Scalability

### Cloud Sync (v2.0)

Agregar Supabase como sincronización opcional:

```
┌──────────────┐
│  Local DB    │ ──┐
│ (PostgreSQL) │   │
└──────────────┘   │
                   ├─→ Sync Service ─→ Supabase (Cloud)
┌──────────────┐   │
│  Otra Sucursal   │
└──────────────┘
```

**Estrategia**:
- Conflict resolution: Last-Write-Wins (LWW)
- Incremental sync (solo cambios)
- Offline-first (cola de sincronización)

---

## Technical Debt & Risks

### Current Technical Debt

- No tests automáticos (se añaden en Phase 4.4)
- No logging estructurado (usar Pino después)
- No manejo de errores centralizado (middleware futuro)

### Architectural Risks

| Riesgo | Probabilidad | Mitigación |
|--------|--------------|------------|
| Prisma migrations complejas | Media | Mantener schema simple, evitar cambios grandes |
| JWT sin refresh token | Baja | Por ahora OK, agregar en v2 |
| No backup automático | Alta | Documentar proceso manual, script futuro |
| Single point of failure (monolito) | Baja | Acceptable para MVP, escalar después |

---

**Status**: Este diseño es para MVP. Se revisará y refinará en cada milestone.

---

**Autor**: Claude Code + Luis González  
**Próxima revisión**: Al completar Milestone 1
