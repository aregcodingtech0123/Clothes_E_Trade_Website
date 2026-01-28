// Seed script for adding sample products with variants and discounts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const clothingCategory = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
    },
  });

  const shoesCategory = await prisma.category.upsert({
    where: { slug: 'shoes' },
    update: {},
    create: {
      name: 'Shoes',
      slug: 'shoes',
    },
  });

  const jewelryCategory = await prisma.category.upsert({
    where: { slug: 'jewelry' },
    update: {},
    create: {
      name: 'Jewelry',
      slug: 'jewelry',
    },
  });

  const discountedCategory = await prisma.category.upsert({
    where: { slug: 'discounted' },
    update: {},
    create: {
      name: 'Discounted',
      slug: 'discounted',
    },
  });

  // Create brands
  const brand1 = await prisma.brand.upsert({
    where: { slug: 'fashion-forward' },
    update: {},
    create: {
      name: 'Fashion Forward',
      slug: 'fashion-forward',
    },
  });

  const brand2 = await prisma.brand.upsert({
    where: { slug: 'style-masters' },
    update: {},
    create: {
      name: 'Style Masters',
      slug: 'style-masters',
    },
  });

  const brand3 = await prisma.brand.upsert({
    where: { slug: 'elegant-wear' },
    update: {},
    create: {
      name: 'Elegant Wear',
      slug: 'elegant-wear',
    },
  });

  // Clothing products with size variants
  const clothingProducts = [
    {
      name: 'Classic White T-Shirt',
      description: 'Premium cotton t-shirt with modern fit. Perfect for everyday wear.',
      price: 29.99,
      discountPrice: 19.99,
      stock: 50,
      categoryId: clothingCategory.id,
      brandId: brand1.id,
      productType: 'clothing',
      variants: {
        sizes: ['S', 'M', 'L', 'XL']
      },
      isActive: true,
    },
    {
      name: 'Denim Jacket',
      description: 'Classic denim jacket with vintage wash. Timeless style for any season.',
      price: 79.99,
      discountPrice: 59.99,
      stock: 30,
      categoryId: clothingCategory.id,
      brandId: brand2.id,
      productType: 'clothing',
      variants: {
        sizes: ['S', 'M', 'L', 'XL']
      },
      isActive: true,
    },
    {
      name: 'Summer Dress',
      description: 'Lightweight summer dress with floral pattern. Perfect for warm weather.',
      price: 49.99,
      stock: 40,
      categoryId: clothingCategory.id,
      brandId: brand3.id,
      productType: 'clothing',
      variants: {
        sizes: ['S', 'M', 'L', 'XL']
      },
      isActive: true,
    },
  ];

  // Shoes with gender and size variants
  const shoesProducts = [
    {
      name: 'Running Sneakers',
      description: 'Comfortable running shoes with advanced cushioning technology.',
      price: 89.99,
      discountPrice: 69.99,
      stock: 25,
      categoryId: shoesCategory.id,
      brandId: brand1.id,
      productType: 'shoes',
      variants: {
        gender: ['Men', 'Women'],
        sizes: ['EU 35', 'EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45']
      },
      isActive: true,
    },
    {
      name: 'Leather Boots',
      description: 'Premium leather boots with classic design. Durable and stylish.',
      price: 129.99,
      stock: 20,
      categoryId: shoesCategory.id,
      brandId: brand2.id,
      productType: 'shoes',
      variants: {
        gender: ['Men', 'Women'],
        sizes: ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45']
      },
      isActive: true,
    },
  ];

  // Jewelry with international sizing
  const jewelryProducts = [
    {
      name: 'Silver Ring',
      description: 'Elegant silver ring with intricate design. Perfect for special occasions.',
      price: 59.99,
      discountPrice: 39.99,
      stock: 15,
      categoryId: jewelryCategory.id,
      brandId: brand3.id,
      productType: 'jewelry',
      variants: {
        jewelrySizes: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10']
      },
      isActive: true,
    },
    {
      name: 'Gold Necklace',
      description: 'Beautiful gold necklace with pendant. A timeless piece of jewelry.',
      price: 149.99,
      stock: 10,
      categoryId: jewelryCategory.id,
      brandId: brand3.id,
      productType: 'jewelry',
      variants: {
        jewelrySizes: ['16"', '18"', '20"', '22"', '24"']
      },
      isActive: true,
    },
    {
      name: 'Diamond Earrings',
      description: 'Stunning diamond earrings with elegant setting. Perfect for formal events.',
      price: 299.99,
      discountPrice: 199.99,
      stock: 8,
      categoryId: jewelryCategory.id,
      brandId: brand3.id,
      productType: 'jewelry',
      variants: {
        jewelrySizes: ['Small', 'Medium', 'Large']
      },
      isActive: true,
    },
  ];

  // Discounted products
  const discountedProducts = [
    {
      name: 'Winter Coat',
      description: 'Warm winter coat with hood. Stay cozy during cold months.',
      price: 149.99,
      discountPrice: 99.99,
      stock: 35,
      categoryId: discountedCategory.id,
      brandId: brand1.id,
      productType: 'clothing',
      variants: {
        sizes: ['S', 'M', 'L', 'XL']
      },
      isActive: true,
    },
    {
      name: 'Casual Sneakers',
      description: 'Comfortable casual sneakers for everyday wear. Great value!',
      price: 69.99,
      discountPrice: 49.99,
      stock: 28,
      categoryId: discountedCategory.id,
      brandId: brand2.id,
      productType: 'shoes',
      variants: {
        gender: ['Men', 'Women'],
        sizes: ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43']
      },
      isActive: true,
    },
    {
      name: 'Silver Bracelet',
      description: 'Delicate silver bracelet with charm. On sale now!',
      price: 79.99,
      discountPrice: 49.99,
      stock: 22,
      categoryId: discountedCategory.id,
      brandId: brand3.id,
      productType: 'jewelry',
      variants: {
        jewelrySizes: ['Small', 'Medium', 'Large']
      },
      isActive: true,
    },
  ];

  // Create all products
  const allProducts = [...clothingProducts, ...shoesProducts, ...jewelryProducts, ...discountedProducts];

  for (const product of allProducts) {
    // Check if product already exists by name
    const existing = await prisma.product.findFirst({
      where: { name: product.name }
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: product,
      });
    } else {
      await prisma.product.create({
        data: product,
      });
    }
  }

  console.log(`✅ Created ${allProducts.length} products`);
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
