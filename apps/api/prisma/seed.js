/**
 * Saori SO - Seed Script
 * 
 * Este script inicializa la base de datos con datos de prueba:
 * - Usuario admin por defecto
 * - Categorías de ejemplo
 * - Productos de ejemplo
 * - Cliente de ejemplo
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...\n');

    // ==========================================
    // 1. USUARIO ADMIN
    // ==========================================

    console.log('👤 Creando usuario administrador...');

    const adminPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@saori.local' },
        update: {},
        create: {
            email: 'admin@saori.local',
            passwordHash: adminPassword,
            role: 'ADMIN',
            name: 'Administrador'
        },
    });

    console.log(`✅ Usuario creado: ${admin.email} (password: admin123)\n`);

    // ==========================================
    // 2. CATEGORÍAS
    // ==========================================

    console.log('📁 Creando categorías...');

    const bebidas = await prisma.category.create({
        data: { name: 'Bebidas' }
    });

    await prisma.category.createMany({
        data: [
            { name: 'Refrescos', parentId: bebidas.id },
            { name: 'Cervezas', parentId: bebidas.id },
            { name: 'Jugos', parentId: bebidas.id },
        ]
    });

    const alimentos = await prisma.category.create({
        data: { name: 'Alimentos' }
    });

    await prisma.category.createMany({
        data: [
            { name: 'Snacks', parentId: alimentos.id },
            { name: 'Dulces', parentId: alimentos.id },
        ]
    });

    const abarrotes = await prisma.category.create({
        data: { name: 'Abarrotes' }
    });

    console.log(`✅ ${await prisma.category.count()} categorías creadas\n`);

    // ==========================================
    // 3. PRODUCTOS
    // ==========================================

    console.log('📦 Creando productos de ejemplo...');

    // Obtener IDs de subcategorías
    const refrescos = await prisma.category.findFirst({ where: { name: 'Refrescos' } });
    const snacks = await prisma.category.findFirst({ where: { name: 'Snacks' } });
    const dulces = await prisma.category.findFirst({ where: { name: 'Dulces' } });

    await prisma.product.createMany({
        data: [
            // Refrescos
            {
                name: 'Coca-Cola 600ml',
                sku: 'BEB-001',
                categoryId: refrescos.id,
                priceBuy: 10.00,
                priceSell: 15.00,
                stock: 50,
                stockMin: 10,
                barcode: '7501055340019',
                unit: 'pza'
            },
            {
                name: 'Pepsi 600ml',
                sku: 'BEB-002',
                categoryId: refrescos.id,
                priceBuy: 9.50,
                priceSell: 14.00,
                stock: 40,
                stockMin: 10,
                barcode: '7501055339013',
                unit: 'pza'
            },
            {
                name: 'Fanta Naranja 600ml',
                sku: 'BEB-003',
                categoryId: refrescos.id,
                priceBuy: 10.00,
                priceSell: 15.00,
                stock: 30,
                stockMin: 10,
                unit: 'pza'
            },
            // Snacks
            {
                name: 'Sabritas Original 45g',
                sku: 'SNK-001',
                categoryId: snacks.id,
                priceBuy: 8.00,
                priceSell: 12.00,
                stock: 60,
                stockMin: 20,
                unit: 'pza'
            },
            {
                name: 'Takis Fuego 62g',
                sku: 'SNK-002',
                categoryId: snacks.id,
                priceBuy: 10.00,
                priceSell: 15.00,
                stock: 45,
                stockMin: 15,
                unit: 'pza'
            },
            // Dulces
            {
                name: 'Carlos V',
                sku: 'DUL-001',
                categoryId: dulces.id,
                priceBuy: 5.00,
                priceSell: 8.00,
                stock: 100,
                stockMin: 30,
                unit: 'pza'
            },
            {
                name: 'Mazapán de La Rosa',
                sku: 'DUL-002',
                categoryId: dulces.id,
                priceBuy: 3.00,
                priceSell: 5.00,
                stock: 80,
                stockMin: 25,
                unit: 'pza'
            },
        ]
    });

    console.log(`✅ ${await prisma.product.count()} productos creados\n`);

    // ==========================================
    // 4. CLIENTE DE EJEMPLO
    // ==========================================

    console.log('👥 Creando cliente de ejemplo...');

    await prisma.customer.create({
        data: {
            name: 'Juan Pérez',
            email: 'juan.perez@example.com',
            phone: '7771234567',
            rfc: 'PEXJ850101XXX',
            address: 'Av. Principal #123, Col. Centro, Cuernavaca, Morelos',
            notes: 'Cliente frecuente, paga siempre en efectivo'
        }
    });

    console.log(`✅ Cliente creado\n`);

    // ==========================================
    // RESUMEN
    // ==========================================

    console.log('✅ Seed completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - Usuarios: ${await prisma.user.count()}`);
    console.log(`   - Categorías: ${await prisma.category.count()}`);
    console.log(`   - Productos: ${await prisma.product.count()}`);
    console.log(`   - Clientes: ${await prisma.customer.count()}`);
    console.log('\n🔐 Credenciales de login:');
    console.log('   Email: admin@saori.local');
    console.log('   Password: admin123\n');
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seed:');
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
