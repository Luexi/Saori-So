# Saori SO - Especificación del Proyecto

**Tipo**: ERP/CRM para MiPyMEs  
**Status**: DRAFT  
**Versión**: 0.1.0  
**Última actualización**: 2026-01-21

---

## Contexto del Proyecto

**Investigador/Desarrollador**: Luis González (Estudiante de Maestría en Dirección de Organizaciones)  
**Email**: luexigonzalez@gmail.com  
**Tesis**: Digitalización de microempresas mexicanas  
**Experiencia**: Aprendiendo programación mediante vibe coding  
**Metodología**: GSD (Get Shit Done) con Claude Code + Antigravity

### Motivación

Las microempresas mexicanas (1-15 empleados) enfrentan un problema crítico de digitalización:
- Los ERP/CRM existentes son complejos y costosos
- Las MiPyMEs dependen de Excel, cuadernos y memoria
- No existen opciones ligeras que funcionen en hardware básico
- Dolibarr es funcional pero su UI está desactualizada

**Saori SO** nace como solución de código abierto para democratizar la gestión empresarial.

---

## Visión del Producto

### Identidad

**Nombre**: Saori SO  
**Tagline**: "El sistema que tu negocio necesita, sin complicaciones"  
**Licencia**: Código abierto (por definir: MIT/GPL)

### Usuarios Objetivo

1. **Restaurantes pequeños** (1-15 empleados)
2. **Tiendas de abarrotes**
3. **Papelerías**
4. **Bares y cafeterías**
5. **Cualquier MiPyME mexicana**

**Perfil común**:
- Dueño que trabaja en el negocio
- Hardware limitado (computadoras viejas)
- Conexión a internet irregular
- Sin conocimientos técnicos avanzados
- Necesidad de control básico pero efectivo

### Propuesta de Valor

| Beneficio | Descripción |
|-----------|-------------|
| **Gratis** | Sin costos de licencia ni suscripciones |
| **Ligero** | Corre en hardware de gama baja |
| **Local-first** | Funciona sin internet |
| **UI Moderna** | Interfaz intuitiva y agradable |
| **México-específico** | Pesos MXN, RFC, estructura fiscal mexicana |
| **Código abierto** | Transparente, auditable, modificable |

---

## Problema y Solución

### Problema

Las microempresas mexicanas gestionan su negocio con:
- **Excel**: Propenso a errores, sin control de acceso
- **Cuadernos**: Imposible analizar tendencias
- **Memoria**: Pérdida de información crítica
- **WhatsApp**: Desorganizado para gestión seria

**Consecuencias**:
- Inventario inexacto → pérdidas por robo/merma
- Sin historial de clientes → oportunidades perdidas
- Decisiones sin datos → crecimiento lento
- Procesos manuales → tiempo desperdiciado

### Solución

Un sistema **todo en uno** que combina:
- ✅ Punto de Venta táctil
- ✅ Control de inventario en tiempo real
- ✅ CRM básico con historial de clientes
- ✅ Reportes visuales y exportables
- ✅ Arquitectura local-first con sincronización opcional

**Diferenciador clave**: Inspirado en Dolibarr pero con UI moderna basada en diseños de Figma.

---

## Requerimientos Técnicos

### Arquitectura

```
┌─────────────────────────────────────┐
│    Frontend (Svelte + Vite)         │
│  - UI Components                    │
│  - State Management (Stores)        │
│  - Routing                          │
└──────────────┬──────────────────────┘
               │ HTTP/WebSocket
┌──────────────▼──────────────────────┐
│    Backend (Fastify + Node.js)      │
│  - RESTful API                      │
│  - JWT Authentication               │
│  - Business Logic                   │
└──────────────┬──────────────────────┘
               │ Prisma ORM
┌──────────────▼──────────────────────┐
│    Database (PostgreSQL)            │
│  - Local instance (Docker)          │
│  - Schema managed by Prisma         │
└─────────────────────────────────────┘
```

**Principios arquitectónicos**:
- **Monolito modular**: No microservicios (por ahora)
- **Local-first**: 100% funcional sin internet
- **Sync-ready**: Preparado para Supabase después
- **Mobile-first**: Diseñado para tablets en mostrador

### Stack Tecnológico

| Categoría | Tecnología | Versión | Justificación |
|-----------|------------|---------|---------------|
| **Runtime** | Node.js | 18+ | Estable y bien soportado |
| **Frontend** | Svelte | 4+ | Más ligero y rápido que React |
| **Build Tool** | Vite | 5+ | Arranque instantáneo, HMR rápido |
| **Backend** | Fastify | 4+ | Más performante que Express |
| **Database** | PostgreSQL | 15+ | Robusto, gratis, ACID compliant |
| **ORM** | Prisma | 5+ | Type-safe, migraciones automáticas |
| **Validación** | Zod | - | Validación runtime + tipos TypeScript |
| **Auth** | JWT | - | Stateless, simple para empezar |
| **Estilos** | Tailwind CSS | 3+ | Utility-first, fácil de personalizar |
| **Iconos** | Material Symbols Outlined | - | Consistente con diseño de Figma |
| **Tipografía** | Manrope (Google Fonts) | - | Según diseño de referencia |

**NO se usará**:
- ❌ React / Next.js (demasiado pesado)
- ❌ Express (Fastify es más rápido)
- ❌ MongoDB (necesitamos ACID garantizado)
- ❌ SSR (no importa SEO, es app interna)

---

## Módulos MVP (Fase 1)

### 1. Punto de Venta (POS) 🛒

**Objetivo**: Cobrar ventas de forma rápida y precisa

**Funcionalidades**:
- Pantalla táctil optimizada
- Catálogo de productos con categorías
- Carrito de compra con modificación de cantidades
- Métodos de pago:
  - Efectivo (con cálculo de cambio)
  - Tarjeta
  - Transferencia
- Generación de ticket imprimible
- Corte de caja diario

**Flujo de uso**:
1. Cajero selecciona productos → se agregan al carrito
2. Puede modificar cantidades o eliminar items
3. Presiona "Cobrar"
4. Selecciona método de pago
5. Si es efectivo, captura monto recibido → sistema calcula cambio
6. Sistema genera ticket
7. Registra venta y actualiza inventario automáticamente

**Atajos de teclado**:
- `F1`: Nuevo ticket
- `F2`: Buscar producto
- `F3`: Cobrar
- `ESC`: Cancelar operación

### 2. Inventario 📦

**Objetivo**: Control preciso de stock

**Funcionalidades**:
- Alta/baja/modificación de productos
- Control de stock en tiempo real
- Alertas de stock bajo (configurables)
- Categorías de productos (jerárquicas)
- Soporte para código de barras (opcional)
- Precio de compra y venta
- Margen de ganancia automático

**Campos del producto**:
- Nombre
- SKU/Código
- Categoría
- Precio compra
- Precio venta
- Stock actual
- Stock mínimo
- Unidad (pza, kg, lt, etc.)
- Código de barras (opcional)
- Imagen (opcional)

### 3. CRM Básico 👥

**Objetivo**: Conocer y fidelizar clientes

**Funcionalidades**:
- Registro de clientes
- Datos de contacto (nombre, teléfono, email, RFC)
- Historial de compras por cliente
- Total gastado (lifetime value)
- Frecuencia de compra
- Notas y comentarios libres
- Búsqueda rápida

**Casos de uso**:
- Identificar mejores clientes
- Recuperar ventas fiadas
- Contactar para promociones
- Análisis de comportamiento

### 4. Ventas y Reportes 📊

**Objetivo**: Tomar decisiones con datos

**Funcionalidades**:
- Dashboard principal con métricas clave:
  - Ventas del día/semana/mes
  - Comparación con periodo anterior
  - Productos más vendidos
  - Ventas por categoría
- Gráficas simples (barras, líneas)
- Filtros por rango de fechas
- Exportación a Excel
- Reporte de corte de caja

**Métricas prioritarias**:
- Ingreso total
- Ticket promedio
- Productos vendidos (unidades)
- Métodos de pago usados
- Mejor hora de venta

### 5. Configuración ⚙️

**Objetivo**: Personalizar el sistema

**Funcionalidades**:
- Datos del negocio:
  - Nombre
  - RFC
  - Dirección
  - Logo (opcional)
- Gestión de usuarios:
  - Admin (acceso total)
  - Cajero (solo POS)
- Configuración de impresora de tickets
- Formato de moneda (MXN por defecto)
- Política de inventario (FIFO, LIFO, Promedio)

---

## Diseño UI/UX

### Referencias Visuales

**Archivos de diseño** (exportados de Figma):
- `docs/ui-reference/code.html`: Dashboard principal
- `docs/ui-reference/code2.html`: Vista de proyecto/detalle
- `docs/ui-reference/code3.html`: Gestión de clientes (CRM)

**Estos archivos son la guía exacta del diseño a implementar.**

### Sistema de Diseño

#### Colores

```css
/* Primarios */
--primary: #295570;        /* Azul corporativo */
--primary-hover: #1f4154;  
--primary-light: #e8f1f5;  

/* Fondos */
--bg-light: #f9fafb;       /* Fondo claro */
--surface: #ffffff;        /* Tarjetas/superficies */
--bg-dark: #131516;        /* Dark mode */

/* Textos */
--text-primary: #131516;   
--text-secondary: #6b7880; 
--text-light: #9ca3af;     

/* Estados */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

#### Tipografía

- **Familia**: Manrope (Google Fonts)
- **Pesos**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Escala**:
  - Título principal: 32px / Bold
  - Título sección: 24px / SemiBold
  - Subtítulo: 18px / Medium
  - Cuerpo: 16px / Regular
  - Auxiliar: 14px / Regular

#### Iconos

- **Librería**: Material Symbols Outlined
- **Tamaño base**: 24px
- **Variantes**: 20px (pequeño), 32px (grande)

#### Espaciado

```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

#### Bordes

- **Radio**: 8px (estándar), 12px (tarjetas), 4px (inputs)
- **Grosor**: 1px (líneas), 2px (énfasis)

#### Sombras

```css
--shadow-soft: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
```

### Principios de Diseño

1. **Minimalista pero no vacío**: Información clara sin saturar
2. **Prioritario por jerarquía**: Lo importante grande y visible
3. **Feedback inmediato**: Respuesta visual a cada acción
4. **Mobile-first**: Diseñado primero para tablets (mostrador)
5. **Dark mode incluido**: Para uso nocturno en bares/restaurantes
6. **Cero animaciones innecesarias**: Solo transiciones útiles (200ms)
7. **Accesibilidad**: Contraste WCAG AA mínimo

---

## Estructura de Archivos

```
saori-so/
├── .agent/                    # GSD workflows
├── .gemini/                   # GSD rules
├── .gsd/                      # GSD state files
│   ├── SPEC.md               # Este archivo
│   ├── ROADMAP.md
│   ├── STATE.md
│   ├── ARCHITECTURE.md
│   ├── STACK.md
│   └── JOURNAL.md
├── docs/
│   ├── ui-reference/         # HTML de Figma
│   │   ├── code.html
│   │   ├── code2.html
│   │   └── code3.html
│   └── reference/
│       └── dolibarr/         # Dolibarr clonado como referencia
├── apps/
│   ├── web/                  # Frontend Svelte
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ui/          # Componentes base (Button, Input, etc.)
│   │   │   │   │   ├── pos/         # Componentes del POS
│   │   │   │   │   ├── inventory/   # Componentes de inventario
│   │   │   │   │   └── crm/         # Componentes de CRM
│   │   │   │   ├── stores/          # Svelte stores (estado global)
│   │   │   │   └── utils/           # Utilidades y helpers
│   │   │   ├── routes/              # SvelteKit routes
│   │   │   │   ├── +layout.svelte   # Layout principal
│   │   │   │   ├── +page.svelte     # Dashboard
│   │   │   │   ├── pos/
│   │   │   │   ├── inventory/
│   │   │   │   ├── customers/
│   │   │   │   ├── reports/
│   │   │   │   └── settings/
│   │   │   └── app.html             # HTML shell
│   │   ├── static/                  # Archivos estáticos
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── svelte.config.js
│   │   └── tailwind.config.js
│   └── api/                         # Backend Fastify
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.js          # Login, logout
│       │   │   ├── products.js      # CRUD productos
│       │   │   ├── customers.js     # CRUD clientes
│       │   │   ├── sales.js         # Ventas y POS
│       │   │   ├── reports.js       # Reportes
│       │   │   └── config.js        # Configuración
│       │   ├── services/            # Lógica de negocio
│       │   ├── schemas/             # Esquemas Zod
│       │   ├── plugins/             # Plugins Fastify
│       │   └── server.js            # Entry point
│       ├── prisma/
│       │   ├── schema.prisma        # Modelo de datos
│       │   └── migrations/          # Migraciones
│       ├── package.json
│       └── .env.example
├── packages/
│   └── shared/                      # Código compartido
│       ├── types/                   # TypeScript types
│       └── constants/               # Constantes compartidas
├── docker-compose.yml               # PostgreSQL local
├── package.json                     # Workspace root
├── .gitignore
├── README.md
└── LICENSE
```

---

## Flujo de Desarrollo (Roadmap de Alto Nivel)

### Fase 1 - Fundación (Semana 1-2)

Objetivo: Infraestructura básica funcional

1. Setup del proyecto con estructura monorepo
2. Docker Compose para PostgreSQL
3. Schema de Prisma básico (usuarios, productos, clientes)
4. API de autenticación (login/logout con JWT)
5. Layout principal con sidebar
6. Sistema de rutas en SvelteKit

### Fase 2 - Módulos Core (Semana 3-4)

Objetivo: Funcionalidad básica de negocio

1. CRUD de productos con categorías
2. CRUD de clientes
3. Punto de venta funcional
4. Registro de ventas
5. Corte de caja diario

### Fase 3 - Reportes (Semana 5)

Objetivo: Análisis de datos

1. Dashboard con métricas clave
2. Reportes de ventas (filtros por fecha)
3. Gráficas básicas
4. Exportación a Excel

### Fase 4 - Pulido (Semana 6)

Objetivo: Producto presentable

1. Dark mode completo
2. Responsive design (tablet/desktop)
3. Documentación de usuario
4. Testing básico (smoke tests)
5. Optimización de rendimiento

---

## Reglas de Desarrollo

### Siempre

- ✅ Usar `/plan` antes de escribir código
- ✅ Commits atómicos después de cada tarea
- ✅ Verificar que funcione antes de pasar a lo siguiente
- ✅ Comentar el código en español
- ✅ Seguir el sistema de diseño de los HTML de referencia
- ✅ Actualizar STATE.md después de cada tarea significativa

### Nunca

- ❌ Usar React o Next.js
- ❌ Crear archivos sin explicar qué hacen
- ❌ Asumir conocimiento previo - explicar todo
- ❌ Hacer cambios grandes sin aprobación
- ❌ Ignorar los archivos HTML de referencia
- ❌ Violar reglas GSD (Planning Lock, State Persistence, etc.)

### Formato de Commits

```
feat(módulo): descripción breve
fix(módulo): corrección de bug
docs: actualización de documentación
refactor(módulo): mejora de código sin cambiar funcionalidad
test(módulo): agregar o modificar tests
chore: tareas de mantenimiento
```

**Ejemplos**:
```
feat(pos): implementar carrito de compra
fix(inventory): corregir cálculo de stock
docs: agregar guía de instalación
refactor(api): extraer validaciones a schemas
```

---

## Criterios de Éxito MVP

El MVP se considera completo cuando:

1. ✅ Un usuario puede registrarse e iniciar sesión
2. ✅ Se pueden dar de alta productos con categorías
3. ✅ El POS permite cobrar ventas con efectivo y tarjeta
4. ✅ El inventario se actualiza automáticamente tras cada venta
5. ✅ Se puede registrar un cliente y ver su historial de compras
6. ✅ El dashboard muestra ventas del día/semana/mes
7. ✅ Se puede exportar un reporte a Excel
8. ✅ El sistema funciona sin conexión a internet
9. ✅ La UI sigue fielmente los diseños de Figma
10. ✅ Un negocio real puede usar el sistema para operar

---

## Supuestos y Restricciones

### Supuestos

- El hardware objetivo es una computadora con al menos 4GB RAM
- PostgreSQL se ejecutará localmente vía Docker
- El usuario tiene conocimientos básicos de computación
- La impresora de tickets usa ESC/POS (estándar)

### Restricciones

- **Presupuesto**: $0 (solo herramientas gratuitas)
- **Tiempo**: MVP en 30 días (6 semanas)
- **Equipo**: 1 desarrollador (Luis) + 1 AI assistant (Claude)
- **Idioma**: Español para UI y comentarios
- **Alcance**: Solo funciones críticas en MVP

---

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Falta de conocimiento técnico | Alta | Alto | GSD + documentación exhaustiva + Claude Code |
| Scope creep (agregar funciones) | Media | Alto | Seguir SPEC.md estrictamente, roadmap fijo |
| Problemas de rendimiento | Baja | Medio | Pruebas en hardware limitado desde el inicio |
| Complejidad de Prisma | Media | Medio | Usar schema simple, evitar relaciones complejas |
| Desviación del diseño | Media | Medio | Comparar constantemente con HTML de referencia |

---

## Próximos Pasos

1. **Finalizar SPEC.md**: Obtener aprobación de Luis
2. **Crear ROADMAP.md**: Detallar fases en tareas ejecutables
3. **Ejecutar Fase 1**: Fundación del proyecto
4. **Verificar Empíricamente**: Screenshots y pruebas reales

---

## Status del Documento

**Status**: DRAFT

**Pendiente para FINALIZAR**:
- [ ] Revisión completa por Luis
- [ ] Confirmación de prioridades de módulos
- [ ] Validación de stack tecnológico
- [ ] Aprobación de criterios de éxito

**Una vez aprobado, cambiar status a: FINALIZED**

---

**Autor**: Claude Code + Luis González  
**Última revisión**: 2026-01-21  
**Próxima revisión**: Al completar cada fase
