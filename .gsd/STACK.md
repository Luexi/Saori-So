# Saori SO - Technology Stack

**Versión**: 0.1.0  
**Última actualización**: 2026-01-21  
**Status**: Approved

---

## Stack Overview

Saori SO usa un stack moderno orientado a **performance** y **developer experience**, optimizado para correr en hardware limitado.

---

## Runtime Environment

### Node.js

**Versión**: 18+ LTS (recomendado: 20.x)  
**Por qué**: Estable, bien soportado, compatible con todas las dependencias

**Instalación**:
```bash
# Verificar versión
node --version  # debe ser >= 18.0.0

# Windows
winget install OpenJS.NodeJS.LTS

# macOS
brew install node@20

# Linux
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Frontend Stack

### Core Framework: Svelte 4

**Versión**: ^4.0.0  
**Site**: https://svelte.dev

**Por qué Svelte (NO React)**:
- ✅ Bundle size 70% más pequeño
- ✅ No Virtual DOM → rendering más rápido
- ✅ Sintaxis más simple (menos boilerplate)
- ✅ Reactividad nativa (sin hooks complejos)
- ✅ Performance superior en hardware limitado

**Ejemplo**:
```svelte
<script>
  let count = 0;  // Reactivo automáticamente
  $: doubled = count * 2;  // Computed value
</script>

<button on:click={() => count++}>
  Clicks: {count}, Doubled: {doubled}
</button>
```

---

### Meta-Framework: SvelteKit

**Versión**: ^2.0.0  
**Site**: https://kit.svelte.dev

**Funcionalidades usadas**:
- File-based routing
- Layouts anidados
- Client-side navigation (SPA mode)
- Server hooks (para auth)
- Form actions (futuro)

**Estructura de rutas**:
```
src/routes/
├── +layout.svelte          # Layout global
├── +page.svelte            # Dashboard (/)
├── login/
│   └── +page.svelte        # Login (/login)
├── pos/
│   └── +page.svelte        # Punto de Venta (/pos)
├── inventory/
│   └── +page.svelte        # Inventario (/inventory)
└── customers/
    ├── +page.svelte        # Lista (/customers)
    └── [id]/
        └── +page.svelte    # Detalle (/customers/:id)
```

---

### Build Tool: Vite

**Versión**: ^5.0.0  
**Site**: https://vitejs.dev

**Por qué Vite (NO Webpack)**:
- ⚡ HMR instantáneo (< 50ms)
- ⚡ Arranque en < 1 segundo
- 📦 Build optimizado con Rollup
- 🔌 Plugins nativos para Svelte

**Configuración** (`vite.config.js`):
```js
import { sveltekit } from '@sveltejs/kit/vite';

export default {
  plugins: [sveltekit()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'  // Proxy a backend
    }
  }
};
```

---

### Styling: Tailwind CSS

**Versión**: ^3.4.0  
**Site**: https://tailwindcss.com

**Por qué Tailwind**:
- Utility-first → desarrollo rápido
- Purge automático → CSS minimal en producción
- Customización fácil (colores, fuentes, etc.)
- Dark mode built-in

**Configuración** (`tailwind.config.js`):
```js
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',  // Activar dark mode con class="dark"
  theme: {
    extend: {
      colors: {
        primary: '#295570',
        'primary-hover': '#1f4154',
        'bg-light': '#f9fafb',
        surface: '#ffffff',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
};
```

---

### State Management: Svelte Stores

**Built-in de Svelte** (no necesita librería externa)

**Tipos de stores usados**:
```js
// lib/stores/auth.js
import { writable, derived } from 'svelte/store';

export const user = writable(null);
export const token = writable(localStorage.getItem('token'));
export const isAuthenticated = derived(token, $token => !!$token);

export function login(email, password) {
  // Lógica de login
}
```

**Consumo en componentes**:
```svelte
<script>
  import { user, isAuthenticated } from '$lib/stores/auth';
</script>

{#if $isAuthenticated}
  <p>Bienvenido, {$user.email}</p>
{:else}
  <a href="/login">Iniciar sesión</a>
{/if}
```

---

### Icons: Material Symbols Outlined

**CDN**: Google Fonts  
**Site**: https://fonts.google.com/icons

**Uso**:
```html
<!-- En app.html -->
<link rel="stylesheet" 
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />

<!-- En componentes -->
<span class="material-symbols-outlined">shopping_cart</span>
```

---

### Typography: Manrope (Google Fonts)

**CDN**: Google Fonts  
**Site**: https://fonts.google.com/specimen/Manrope

**Pesos usados**: 400, 500, 600, 700

```html
<!-- En app.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Backend Stack

### Web Framework: Fastify

**Versión**: ^4.25.0  
**Site**: https://fastify.dev

**Por qué Fastify (NO Express)**:
- 🚀 2x más rápido que Express
- 📄 Schema-based validation (JSON Schema)
- 🔌 Plugin architecture
- 📊 Logging built-in (Pino)
- ⚡ Async/await first-class

**Ejemplo**:
```js
// src/server.js
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/api/health', async (request, reply) => {
  return { status: 'ok' };
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Server running on http://localhost:3000');
});
```

---

### ORM: Prisma

**Versión**: ^5.8.0  
**Site**: https://www.prisma.io

**Por qué Prisma**:
- Type-safe (TypeScript automático)
- Migraciones automáticas
- Studio (GUI para DB)
- Introspection de DB existente
- Performance excelente

**Schema Example** (`prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id         String   @id @default(uuid())
  name       String
  sku        String   @unique
  price_sell Decimal  @db.Money
  stock      Int      @default(0)
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId String
  createdAt  DateTime @default(now())
}
```

**Comandos útiles**:
```bash
npx prisma migrate dev --name init  # Crear migración
npx prisma studio                   # Abrir GUI
npx prisma db seed                  # Ejecutar seeds
```

---

### Validation: Zod

**Versión**: ^3.22.0  
**Site**: https://zod.dev

**Por qué Zod**:
- Validación runtime + inferencia de tipos
- Mensajes de error personalizables
- Composición de schemas
- Integración perfecta con Fastify

**Ejemplo**:
```js
// schemas/product.js
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  sku: z.string().regex(/^[A-Z0-9-]+$/, 'SKU inválido'),
  price_sell: z.number().positive('El precio debe ser positivo'),
  stock: z.number().int().nonnegative('Stock no puede ser negativo'),
  categoryId: z.string().uuid(),
});

// Uso en ruta
fastify.post('/api/products', async (req, reply) => {
  const data = createProductSchema.parse(req.body);  // Valida y tipea
  const product = await prisma.product.create({ data });
  return product;
});
```

---

### Authentication: JWT

**Librería**: `@fastify/jwt` ^7.2.0  
**Site**: https://github.com/fastify/fastify-jwt

**Por qué JWT**:
- Stateless (no sessions en servidor)
- Fácil de implementar
- Portable (funciona con apps móviles futuras)

**Configuración**:
```js
import fjwt from '@fastify/jwt';

fastify.register(fjwt, {
  secret: process.env.JWT_SECRET || 'supersecret',
  sign: {
    expiresIn: '7d',
  },
});

// Generar token
const token = fastify.jwt.sign({ userId, email, role });

// Verificar token (middleware)
fastify.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});
```

---

### Password Hashing: bcrypt

**Versión**: ^5.1.0  
**Site**: https://github.com/kelektiv/node.bcrypt.js

**Uso**:
```js
import bcrypt from 'bcrypt';

// Al registrar usuario
const password_hash = await bcrypt.hash(password, 10);

// Al hacer login
const valid = await bcrypt.compare(password, user.password_hash);
```

---

## Database Stack

### PostgreSQL

**Versión**: 15+ (recomendado: 16.x)  
**Site**: https://www.postgresql.org

**Por qué PostgreSQL (NO MongoDB)**:
- ACID compliant (transacciones garantizadas)
- Relaciones complejas (sales ↔ products)
- Tipos de datos ricos (Money, UUID, JSON)
- Performance probado en producción
- Gratis y open-source

**Deployment**: Docker local

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: saori-db
    environment:
      POSTGRES_DB: saori
      POSTGRES_USER: saori
      POSTGRES_PASSWORD: saori123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Connection string**:
```
DATABASE_URL="postgresql://saori:saori123@localhost:5432/saori"
```

---

## Development Tools

### Package Manager: npm

**Versión**: 9+ (viene con Node.js)

**Workspaces** (monorepo):
```json
// package.json (root)
{
  "name": "saori-so",
  "private": true,
  "workspaces": [
    "apps/web",
    "apps/api",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "npm run dev --workspace=apps/web",
    "dev:api": "npm run dev --workspace=apps/api",
    "dev": "concurrently \"npm:dev:*\""
  }
}
```

---

### Linting & Formatting

**ESLint**: Linting de código  
**Prettier**: Formateo automático

```bash
npm install -D eslint prettier eslint-config-prettier
```

**Configuración básica** (`.prettierrc`):
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

### Testing (Phase 4.4)

**Backend**: Vitest  
**E2E**: Playwright

```bash
npm install -D vitest @playwright/test
```

---

## Production Dependencies

### Frontend (apps/web/package.json)

```json
{
  "dependencies": {
    "@sveltejs/kit": "^2.0.0",
    "svelte": "^4.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Backend (apps/api/package.json)

```json
{
  "dependencies": {
    "fastify": "^4.25.0",
    "@fastify/cors": "^8.4.0",
    "@fastify/jwt": "^7.2.0",
    "@fastify/env": "^4.3.0",
    "@prisma/client": "^5.8.0",
    "zod": "^3.22.0",
    "bcrypt": "^5.1.0"
  },
  "devDependencies": {
    "prisma": "^5.8.0",
    "nodemon": "^3.0.0"
  }
}
```

---

## Future Stack Additions

**v2.0+**:
- Supabase (cloud sync)
- Chart.js / ApexCharts (gráficas avanzadas)
- ExcelJS (exportación de reportes)
- node-thermal-printer (impresión de tickets)
- React Native (app móvil)

---

## Version Pinning Strategy

**Símbolos en package.json**:
- `^X.Y.Z`: Permitir minor updates (recomendado)
- `~X.Y.Z`: Solo patch updates (muy conservador)
- `X.Y.Z`: Versión exacta (no recomendado, salvo problemas)

**Ejemplo**:
```json
{
  "fastify": "^4.25.0",   // OK: 4.26.0, NOT OK: 5.0.0
  "svelte": "~4.2.0",     // OK: 4.2.1, NOT OK: 4.3.0
  "prisma": "5.8.0"       // Exacto, no actualizar
}
```

---

## Compatibility Matrix

| Tecnología | Versión Mínima | Versión Objetivo | Versión Máxima Probada |
|------------|----------------|------------------|------------------------|
| Node.js | 18.0.0 | 20.10.0 | 21.x |
| PostgreSQL | 14.0 | 16.1 | 16.x |
| Svelte | 4.0.0 | 4.2.8 | 4.x |
| Fastify | 4.25.0 | 4.25.2 | 4.x |
| Prisma | 5.7.0 | 5.8.1 | 5.x |

---

**Status**: Stack aprobado y listo para usar  
**Última validación**: 2026-01-21  
**Próxima revisión**: Milestone 2 (ajustes según experiencia)
