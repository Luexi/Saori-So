/**
 * Saori SO - Fastify Server
 * 
 * Backend API para el sistema ERP/CRM
 * 
 * Stack:
 * - Fastify 4.x (web framework)
 * - Prisma (ORM)
 * - JWT (autenticación)
 * - CORS (desarrollo)
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Crear instancia de Fastify con logging
const fastify = Fastify({
    logger: {
        level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
});

// ==========================================
// PLUGINS
// ==========================================

// CORS - Permitir requests desde el frontend
await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true,
});

// JWT - Autenticación
await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecretkey_CHANGE_IN_PRODUCTION',
    sign: {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
});

// Decorador de Prisma - Disponible en todas las rutas como fastify.prisma
fastify.decorate('prisma', prisma);

// Decorador de autenticación - Middleware para rutas protegidas
fastify.decorate('authenticate', async function (request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.code(401).send({
            error: 'No autorizado',
            message: 'Token inválido o no proporcionado',
        });
    }
});

// ==========================================
// HOOKS (Eventos del ciclo de vida)
// ==========================================

// Hook para cerrar Prisma cuando el servidor se cierra
fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
    instance.log.info('Prisma desconectado');
});

// ==========================================
// RUTAS
// ==========================================

// Health check - Verificar que el servidor está funcionando
fastify.get('/api/health', async (request, reply) => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    };
});

// Health check de la base de datos
fastify.get('/api/health/db', async (request, reply) => {
    try {
        // Intentar una consulta simple a la DB
        await fastify.prisma.$queryRaw`SELECT 1`;
        return {
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        reply.code(503).send({
            status: 'error',
            database: 'disconnected',
            error: error.message,
        });
    }
});

// Ruta de bienvenida
fastify.get('/api', async (request, reply) => {
    return {
        name: 'Saori SO API',
        version: '0.1.0',
        description: 'ERP/CRM para MiPyMEs mexicanas',
        endpoints: {
            health: '/api/health',
            healthDb: '/api/health/db',
            auth: '/api/auth/*',
            products: '/api/products',
            customers: '/api/customers',
            sales: '/api/sales',
        },
    };
});

// ==========================================
// REGISTRO DE RUTAS
// ==========================================

// Rutas de autenticación
await fastify.register(authRoutes, { prefix: '/api/auth' });

// ==========================================
// MANEJO DE ERRORES
// ==========================================

// Handler global de errores
fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    // Error de validación JWT
    if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
        reply.code(401).send({
            error: 'No autorizado',
            message: 'Token de autenticación requerido',
        });
        return;
    }

    // Error de validación Zod (si lo usamos)
    if (error.name === 'ZodError') {
        reply.code(400).send({
            error: 'Validación fallida',
            details: error.issues,
        });
        return;
    }

    // Error genérico del servidor
    reply.code(error.statusCode || 500).send({
        error: 'Error del servidor',
        message: process.env.NODE_ENV === 'development'
            ? error.message
            : 'Ha ocurrido un error interno',
    });
});

// Handler para rutas no encontradas
fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
        error: 'Ruta no encontrada',
        message: `No se encontró ${request.method} ${request.url}`,
    });
});

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================

const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '3000');
        const host = process.env.HOST || '0.0.0.0';

        await fastify.listen({ port, host });

        console.log('\n🚀 Saori SO API corriendo!\n');
        console.log(`📍 URL: http://localhost:${port}`);
        console.log(`🏥 Health: http://localhost:${port}/api/health`);
        console.log(`💾 Database: http://localhost:${port}/api/health/db`);
        console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}\n`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
    fastify.log.info('SIGTERM recibido, cerrando servidor...');
    await fastify.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    fastify.log.info('SIGINT recibido, cerrando servidor...');
    await fastify.close();
    process.exit(0);
});

start();
