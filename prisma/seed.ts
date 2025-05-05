import { PrismaClient } from '@prisma/client';
import { BcryptService } from '../src/infrastructure/services/bcrypt.service'; // Asegúrate de instalar bcryptjs si no lo tienes ya

const prisma = new PrismaClient();

// Función para crear un slug a partir del nombre y la referencia
const createSlug = (name: string, reference: string): string => {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${reference.toLowerCase().replace(/\s+/g, '-')}`;
};

// Datos de productos para seed
const productData = [
  {
    name: 'Proteína Whey Premium',
    description: 'Proteína de suero de leche de alta calidad para el desarrollo muscular. Ideal para después del entrenamiento.',
    price: 29.99,
    quantity: 100,
    reference: 'PROT001'
  },
  {
    name: 'BCAA Complex',
    description: 'Aminoácidos ramificados para mejorar la recuperación muscular y prevenir el catabolismo.',
    price: 19.99,
    quantity: 85,
    reference: 'BCAA002'
  },
  {
    name: 'Creatina Monohidrato',
    description: 'Suplemento para aumentar la fuerza y potencia en entrenamientos de alta intensidad.',
    price: 15.50,
    quantity: 120,
    reference: 'CREA003'
  },
  {
    name: 'Pre-Workout Formula',
    description: 'Fórmula energética para maximizar el rendimiento durante el entrenamiento.',
    price: 24.99,
    quantity: 75,
    reference: 'PRE004'
  },
  {
    name: 'Vitaminas Multideportista',
    description: 'Complejo multivitamínico especialmente formulado para deportistas activos.',
    price: 18.75,
    quantity: 90,
    reference: 'VIT005'
  },
  {
    name: 'Omega 3 Fish Oil',
    description: 'Ácidos grasos esenciales para la salud cardiovascular y función cerebral óptima.',
    price: 22.50,
    quantity: 110,
    reference: 'OMG006'
  },
  {
    name: 'Colágeno Hidrolizado',
    description: 'Suplemento para mejorar la salud de articulaciones, piel y cabello.',
    price: 26.99,
    quantity: 65,
    reference: 'COL007'
  },
  {
    name: 'Glutamina Pura',
    description: 'Aminoácido para mejorar la recuperación y el sistema inmunológico.',
    price: 17.25,
    quantity: 95,
    reference: 'GLU008'
  },
  {
    name: 'Barras Proteicas',
    description: 'Snack alto en proteínas y bajo en azúcares para consumir entre comidas.',
    price: 2.50,
    quantity: 150,
    reference: 'BAR009'
  },
  {
    name: 'Electrolitos Deportivos',
    description: 'Bebida de rehidratación para reponer minerales perdidos durante el ejercicio intenso.',
    price: 14.99,
    quantity: 80,
    reference: 'ELE010'
  }
];

// Función principal para realizar el seed
async function main() {
  console.log(`Start seeding...`);
  const bcryptService = new BcryptService(10); // Instancia del servicio de Bcrypt
  const hashedPassword = await bcryptService.hash('admin123'); // Cambia la contraseña por defecto si es necesario  

  // Eliminar registros existentes para evitar duplicados
  await prisma.product.deleteMany({});

  // Crear nuevos productos
  for (const product of productData) {
    const { name, description, price, quantity, reference } = product;

    const createdProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        reference,
        slug: createSlug(name, reference)
      }
    });

    console.log(`Created product with ID: ${createdProduct.id}`);
  }

  const findAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@nutrabiotics.com',
    },
  });
  if (!findAdmin) {
    await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@nutrabiotics.com',
        password: hashedPassword, // Asegúrate de encriptar la contraseña en producción
        role: 'ADMIN',
      },
    });
  }  

  console.log(`Seeding finished.`);
}

// Ejecutar la función principal
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Cerrar la conexión de Prisma al terminar
    await prisma.$disconnect();
  }); 