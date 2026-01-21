/**
 * Saori SO - Authentication Routes
 * 
 * Rutas para autenticación de usuarios:
 * - POST /api/auth/login - Iniciar sesión
 * - POST /api/auth/register - Registrar nuevo usuario (admin only)
 */

import bcrypt from 'bcrypt';
import { z } from 'zod';

// ==========================================
// SCHEMAS DE VALIDACIÓN
// ==========================================

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Password requerido'),
});

const registerSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
    name: z.string().min(1, 'Nombre requerido'),
    role: z.enum(['ADMIN', 'CASHIER']).optional().default('CASHIER'),
});

// ==========================================
// RUTAS
// ==========================================

export default async function authRoutes(fastify, options) {

    /**
     * POST /api/auth/login
     * Iniciar sesión y obtener JWT token
     */
    fastify.post('/login', async (request, reply) => {
        try {
            // Validar datos de entrada
            const { email, password } = loginSchema.parse(request.body);

            // Buscar usuario por email
            const user = await fastify.prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    passwordHash: true,
                    role: true,
                    name: true,
                },
            });

            // Verificar que el usuario existe
            if (!user) {
                return reply.code(401).send({
                    error: 'Credenciales inválidas',
                    message: 'Email o password incorrectos',
                });
            }

            // Verificar password
            const passwordMatch = await bcrypt.compare(password, user.passwordHash);

            if (!passwordMatch) {
                return reply.code(401).send({
                    error: 'Credenciales inválidas',
                    message: 'Email o password incorrectos',
                });
            }

            // Generar JWT token
            const token = fastify.jwt.sign({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            // Responder con token y datos del usuario
            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                },
                expiresIn: process.env.JWT_EXPIRES_IN || '7d',
            };

        } catch (error) {
            // Error de validación Zod
            if (error instanceof z.ZodError) {
                return reply.code(400).send({
                    error: 'Validación fallida',
                    details: error.errors,
                });
            }

            // Error genérico
            fastify.log.error(error);
            return reply.code(500).send({
                error: 'Error del servidor',
                message: 'Error al procesar login',
            });
        }
    });

    /**
     * POST /api/auth/register
     * Registrar un nuevo usuario (solo para admins)
     */
    fastify.post('/register', {
        onRequest: [fastify.authenticate], // Requiere autenticación
    }, async (request, reply) => {
        try {
            // Verificar que el usuario autenticado es admin
            if (request.user.role !== 'ADMIN') {
                return reply.code(403).send({
                    error: 'Acceso denegado',
                    message: 'Solo administradores pueden registrar usuarios',
                });
            }

            // Validar datos de entrada
            const { email, password, name, role } = registerSchema.parse(request.body);

            // Verificar que el email no esté en uso
            const existingUser = await fastify.prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return reply.code(409).send({
                    error: 'Email en uso',
                    message: 'Ya existe un usuario con este email',
                });
            }

            // Hashear password
            const passwordHash = await bcrypt.hash(password, 10);

            // Crear usuario en la base de datos
            const newUser = await fastify.prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    name,
                    role,
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    name: true,
                    createdAt: true,
                },
            });

            return reply.code(201).send({
                message: 'Usuario creado exitosamente',
                user: newUser,
            });

        } catch (error) {
            // Error de validación Zod
            if (error instanceof z.ZodError) {
                return reply.code(400).send({
                    error: 'Validación fallida',
                    details: error.errors,
                });
            }

            // Error genérico
            fastify.log.error(error);
            return reply.code(500).send({
                error: 'Error del servidor',
                message: 'Error al crear usuario',
            });
        }
    });

    /**
     * GET /api/auth/me
     * Obtener información del usuario autenticado
     */
    fastify.get('/me', {
        onRequest: [fastify.authenticate],
    }, async (request, reply) => {
        try {
            const user = await fastify.prisma.user.findUnique({
                where: { id: request.user.userId },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    name: true,
                    createdAt: true,
                },
            });

            if (!user) {
                return reply.code(404).send({
                    error: 'Usuario no encontrado',
                });
            }

            return { user };

        } catch (error) {
            fastify.log.error(error);
            return reply.code(500).send({
                error: 'Error del servidor',
            });
        }
    });
}
