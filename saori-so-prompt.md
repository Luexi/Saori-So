# 🚀 Prompt Inicial para Claude Code + Antigravity
## Proyecto: Saori SO - ERP/CRM para MiPyMEs

---

## PASO 1: Configuración Inicial del Proyecto

Copia y pega esto en tu terminal antes de abrir Claude Code:

```bash
# Crear directorio del proyecto
mkdir saori-so && cd saori-so

# Inicializar git
git init

# Clonar metodología GSD
git clone https://github.com/toonight/get-shit-done-for-antigravity.git gsd-template

# Copiar estructura GSD
cp -r gsd-template/.agent ./
cp -r gsd-template/.gemini ./
cp -r gsd-template/.gsd ./

# Limpiar
rm -rf gsd-template

# Crear carpeta para referencias de diseño
mkdir -p docs/ui-reference

# Copiar tus archivos HTML de Figma a docs/ui-reference/
# (hazlo manualmente: code.html, code2.html, code3.html)
```

---

## PASO 2: Prompt para `/new-project` en Claude Code

Cuando ejecutes `/new-project`, responde las preguntas con esta información:

```
NOMBRE: Saori SO
DESCRIPCIÓN: ERP/CRM ligero para MiPyMEs mexicanas (1-15 empleados)
TIPO: Aplicación web full-stack con punto de venta
STACK: Svelte + Vite (frontend), Node.js + Fastify (backend), PostgreSQL (local)
OBJETIVO: MVP funcional en 30 días
```

---

## PASO 3: Prompt Principal para SPEC.md

Copia este prompt completo en Claude Code después de `/new-project`:

---

### CONTEXTO DEL PROYECTO

```
Soy Luis, estudiante de Maestría en Dirección de Organizaciones. Mi tesis investiga la digitalización de microempresas. Quiero crear "Saori SO", un ERP/CRM de código abierto, ligero y accesible para negocios pequeños mexicanos: restaurantes, tiendas de abarrotes, papelerías, bares, etc.

NO SÉ PROGRAMAR. Estoy aprendiendo con vibe coding. Necesito que me guíes paso a paso.

El proyecto se inspira en Dolibarr pero con una UI moderna y minimalista. Te adjunto 3 archivos HTML exportados de Figma que muestran exactamente cómo quiero que se vea:
- code.html → Dashboard principal
- code2.html → Vista de proyecto/detalle
- code3.html → Gestión de clientes (CRM)
```

### VISIÓN DEL PRODUCTO

```
NOMBRE: Saori SO
TAGLINE: "El sistema que tu negocio necesita, sin complicaciones"

USUARIOS OBJETIVO:
- Dueños de restaurantes pequeños (1-15 empleados)
- Tiendas de abarrotes
- Papelerías
- Bares y cafeterías
- Cualquier MiPyME que necesite control básico

PROBLEMA QUE RESUELVE:
- Los ERP existentes son complicados y caros
- Las MiPyMEs usan Excel o cuadernos
- No hay opciones ligeras que corran en hardware básico
- Dolibarr funciona pero su UI es anticuada

PROPUESTA DE VALOR:
- Gratis y de código abierto
- Corre en cualquier computadora vieja
- UI moderna y fácil de usar
- Pensado para México (pesos, RFC, facturación)
```

### REQUERIMIENTOS TÉCNICOS

```
ARQUITECTURA:
- Monolito modular (no microservicios)
- Puede correr 100% local sin internet
- Preparado para sincronizar con Supabase después

STACK ELEGIDO (basado en mis notas de vibe coding):
- Frontend: Svelte + Vite (NO React, NO Next.js)
- Backend: Node.js + Fastify
- Base de datos: PostgreSQL local
- ORM: Prisma
- Validación: Zod
- Auth: JWT simple
- Estilos: Tailwind CSS

¿POR QUÉ ESTE STACK?
- Svelte + Vite es más ligero y rápido que React
- Fastify es más performante que Express
- PostgreSQL es robusto y gratis
- No necesito SSR porque no me importa SEO (es app interna)
```

### MÓDULOS MVP (Fase 1)

```
MÓDULO 1: PUNTO DE VENTA (POS)
- Pantalla táctil para cobrar
- Catálogo de productos con categorías
- Carrito de compra
- Métodos de pago: efectivo, tarjeta, transferencia
- Ticket de venta (imprimible)
- Corte de caja diario

MÓDULO 2: INVENTARIO
- Alta/baja de productos
- Control de stock
- Alertas de stock bajo
- Categorías de productos
- Código de barras (opcional)

MÓDULO 3: CLIENTES (CRM básico)
- Registro de clientes
- Historial de compras por cliente
- Datos de contacto
- Notas/comentarios

MÓDULO 4: VENTAS Y REPORTES
- Ventas del día/semana/mes
- Productos más vendidos
- Gráficas simples
- Exportar a Excel

MÓDULO 5: CONFIGURACIÓN
- Datos del negocio
- Usuarios y roles (admin, cajero)
- Impresora de tickets
- Moneda y formato
```

### DISEÑO UI/UX

```
REFERENCIAS VISUALES:
Los 3 archivos HTML en docs/ui-reference/ son mi guía exacta.

SISTEMA DE DISEÑO:
- Tipografía: Manrope (ya está en los HTML)
- Color primario: #295570 (azul corporativo)
- Fondo claro: #f9fafb
- Superficie: #ffffff
- Texto principal: #131516
- Texto secundario: #6b7880
- Iconos: Material Symbols Outlined
- Bordes redondeados: 8px
- Sombras suaves: shadow-soft

PRINCIPIOS:
- Minimalista pero no vacío
- Información clara sin saturar
- Dark mode incluido
- Mobile-first (para tablets en el mostrador)
- Cero animaciones innecesarias
```

### ESTRUCTURA DE ARCHIVOS SUGERIDA

```
saori-so/
├── .agent/                 # GSD workflows
├── .gemini/                # GSD rules
├── .gsd/                   # GSD state files
├── docs/
│   └── ui-reference/       # HTML de Figma
├── apps/
│   ├── web/                # Frontend Svelte
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── components/
│   │   │   │   ├── stores/
│   │   │   │   └── utils/
│   │   │   ├── routes/
│   │   │   └── app.html
│   │   ├── package.json
│   │   └── vite.config.js
│   └── api/                # Backend Fastify
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── schemas/
│       │   └── plugins/
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
├── packages/
│   └── shared/             # Tipos compartidos
├── docker-compose.yml      # PostgreSQL local
├── package.json            # Workspace root
└── README.md
```

### FLUJO DE DESARROLLO

```
FASE 1 - FUNDACIÓN (Semana 1-2):
1. Setup del proyecto con estructura
2. Docker compose para PostgreSQL
3. Schema de Prisma básico
4. API de autenticación
5. Layout principal con sidebar
6. Sistema de rutas

FASE 2 - MÓDULOS CORE (Semana 3-4):
1. CRUD de productos
2. CRUD de clientes
3. Punto de venta funcional
4. Corte de caja

FASE 3 - REPORTES (Semana 5):
1. Dashboard con métricas
2. Reportes de ventas
3. Exportación Excel

FASE 4 - PULIDO (Semana 6):
1. Dark mode
2. Responsive
3. Documentación
4. Testing básico
```

### REGLAS PARA CLAUDE CODE

```
SIEMPRE:
- Usa /plan antes de escribir código
- Commits atómicos después de cada tarea
- Verifica que funcione antes de pasar a lo siguiente
- Comenta el código en español
- Sigue el sistema de diseño de los HTML de referencia

NUNCA:
- Uses React o Next.js
- Crees archivos sin explicar qué hacen
- Asumas que sé algo - explícame todo
- Hagas cambios grandes sin mi aprobación
- Ignores los archivos HTML de referencia

FORMATO DE COMMITS:
feat(módulo): descripción breve
fix(módulo): descripción breve
docs: descripción breve
```

---

## PASO 4: Comandos GSD que usarás frecuentemente

```bash
# Ver tu progreso
/progress

# Planear la siguiente fase
/plan 1

# Ejecutar el plan
/execute 1

# Verificar que funciona
/verify 1

# Pausar y guardar estado
/pause

# Continuar donde te quedaste
/resume

# Mapear la arquitectura actual
/map
```

---

## PASO 5: Para el Punto de Venta específicamente

Cuando llegues a implementar el POS, usa este prompt adicional:

```
El Punto de Venta debe funcionar así:

PANTALLA PRINCIPAL:
- Lado izquierdo (60%): Grid de productos por categorías
- Lado derecho (40%): Carrito actual y totales

FLUJO DE COBRO:
1. Cajero toca productos → se agregan al carrito
2. Puede modificar cantidades o eliminar
3. Toca "Cobrar"
4. Selecciona método de pago
5. Si es efectivo, captura monto recibido y calcula cambio
6. Genera ticket
7. Registra venta y actualiza inventario

ATAJOS DE TECLADO:
- F1: Nuevo ticket
- F2: Buscar producto
- F3: Cobrar
- ESC: Cancelar operación

MODO OFFLINE:
- Debe funcionar sin internet
- Guarda ventas localmente
- Sincroniza cuando hay conexión
```

---

## Notas Finales

Este prompt está diseñado para que Claude Code entienda exactamente qué quieres construir. La metodología GSD te ayudará a mantener el proyecto organizado y evitar el "spaghetti code" típico del vibe coding sin estructura.

Recuerda: **planifica antes de codificar**. Usa `/plan` siempre.

¡Éxito con Saori SO! 🎯
