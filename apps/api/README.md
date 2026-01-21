# Saori SO - Backend API

API backend para el sistema ERP/CRM Saori SO.

## Stack

- **Framework**: Fastify 4.x
- **ORM**: Prisma 5.x
- **Database**: PostgreSQL 16
- **Autenticación**: JWT
- **Validación**: Zod

## Comenzar

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

### 3. Levantar PostgreSQL

```bash
# En la raíz del proyecto
docker-compose up -d
```

### 4. Ejecutar migraciones

```bash
npm run db:migrate
```

### 5. Seed de la base de datos

```bash
npm run db:seed
```

Esto creará:
- 1 usuario admin (`admin@saori.local` / `admin123`)
- 8 categorías
- 7 productos
- 1 cliente de ejemplo

### 6. Iniciar servidor de desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con hot reload |
| `npm start` | Inicia el servidor en modo producción |
| `npm run db:migrate` | Ejecuta las migraciones de Prisma |
| `npm run db:studio` | Abre Prisma Studio (GUI de DB) |
| `npm run db:seed` | Ejecuta el seed de datos iniciales |
| `npm run db:reset` | Resetea la DB (borra todo y vuelve a crear) |

## Endpoints

### Health Checks

- `GET /api/health` - Estado del servidor
- `GET /api/health/db` - Estado de la conexión a DB

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (admin only)

### Productos

- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener un producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Clientes

- `GET /api/customers` - Listar clientes
- `GET /api/customers/:id` - Obtener un cliente
- `POST /api/customers` - Crear cliente
- `PUT /api/customers/:id` - Actualizar cliente
- `DELETE /api/customers/:id` - Eliminar cliente

### Ventas (POS)

- `POST /api/sales` - Crear venta
- `GET /api/sales` - Listar ventas
- `GET /api/sales/:id` - Obtener detalle de venta
- `GET /api/sales/cash-closing` - Corte de caja

### Reportes

- `GET /api/reports/sales` - Reporte de ventas
- `GET /api/reports/dashboard` - Métricas del dashboard
- `GET /api/reports/export` - Exportar a Excel

## Estructura del proyecto

```
apps/api/
├── src/
│   ├── routes/         # Definición de rutas
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── customers.js
│   │   ├── sales.js
│   │   └── reports.js
│   ├── services/       # Lógica de negocio
│   ├── schemas/        # Validaciones Zod
│   ├── plugins/        # Plugins de Fastify
│   ├── utils/          # Utilidades
│   └── server.js       # Entry point
├── prisma/
│   ├── schema.prisma   # Modelo de datos
│   ├── seed.js         # Datos iniciales
│   └── migrations/     # Migraciones
├── .env                # Variables de entorno (no en Git)
└── package.json
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string de PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret para firmar tokens JWT | `supersecret` |
| `JWT_EXPIRES_IN` | Expiración de tokens | `7d` |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno | `development` / `production` |
| `CORS_ORIGIN` | Orígenes permitidos para CORS | `http://localhost:5173` |

## Desarrollo

### Hot Reload

El servidor usa `nodemon` para hot reload automático. Los cambios en archivos `.js` reiniciarán el servidor automáticamente.

### Logs

En desarrollo, los logs son human-readable gracias a `pino-pretty`:

```
[14:30:22] INFO: Server listening on http://localhost:3000
```

En producción, los logs son JSON para fácil parsing.

### Debugging

Para debugging avanzado, usa el inspector de Node.js:

```bash
node --inspect src/server.js
```

Y conecta desde Chrome DevTools en `chrome://inspect`

## Prisma Studio

Para explorar la base de datos visualmente:

```bash
npm run db:studio
```

Abre http://localhost:5555 en tu navegador.

## Testing

_Por implementar en Phase 4.4_

```bash
npm test
```

## Deployment

_Por definir - probablemente local con PM2 o similar_

## Credenciales por defecto

Después del seed:

- **Email**: `admin@saori.local`
- **Password**: `admin123`

**⚠️ IMPORTANTE**: Cambia estas credenciales en producción.
