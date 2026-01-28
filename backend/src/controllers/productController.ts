import { Request, Response } from 'express'
import prisma from '../utils/prisma'
import { ApiError } from '../utils/errorHandler'
import { validateString, validateNumber, validateURL, sanitizeHTML } from '../utils/validation'

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { category, brand, minPrice, maxPrice, search } = req.query

    const whereClause: any = {
      isActive: true
    }

    if (category) {
      whereClause.category = {
        OR: [
          { id: isNaN(Number(category)) ? undefined : Number(category) },
          { slug: String(category) }
        ]
      }
    }

    if (brand) {
      whereClause.brand = {
        OR: [
          { id: isNaN(Number(brand)) ? undefined : Number(brand) },
          { slug: String(brand) }
        ]
      }
    }

    if (minPrice || maxPrice) {
      whereClause.price = {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined
      }
    }

    if (search) {
      // Sanitize search input to prevent injection
      const sanitizedSearch = validateString(search, 'Search', { maxLength: 100 });
      whereClause.OR = [
        { name: { contains: sanitizedSearch, mode: 'insensitive' } },
        { description: { contains: sanitizedSearch, mode: 'insensitive' } }
      ]
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        brand: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(products)
  } catch (error) {
    throw new ApiError(500, 'Failed to fetch products')
  }
}

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        brand: true
      }
    })

    if (!product) {
      throw new ApiError(404, 'Product not found')
    }

    if (!product.isActive && !req.user?.isAdmin) {
      throw new ApiError(404, 'Product not available')
    }

    res.json(product)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, 'Failed to fetch product')
  }
}

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, discountPrice, stock, categoryId, brandId, imageUrl, productType, variants } = req.body

  try {
    // Validate and sanitize inputs
    const validatedName = validateString(name, 'Name', { required: true, maxLength: 100 });
    const validatedDescription = description ? sanitizeHTML(validateString(description, 'Description', { maxLength: 2000 })) : null;
    const validatedPrice = validateNumber(price, 'Price', { required: true, min: 0 });
    const validatedDiscountPrice = discountPrice ? validateNumber(discountPrice, 'Discount Price', { min: 0, max: validatedPrice }) : null;
    const validatedStock = stock !== undefined ? validateNumber(stock, 'Stock', { integer: true, min: 0 }) : 0;
    const validatedImageUrl = imageUrl ? validateURL(imageUrl, 'Image URL') : null;
    const validatedProductType = productType ? validateString(productType, 'Product Type', { maxLength: 20 }) : null;
    
    // Validate variants JSON
    let validatedVariants = null;
    if (variants) {
      try {
        validatedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
        // Basic validation - ensure it's an object
        if (typeof validatedVariants !== 'object' || Array.isArray(validatedVariants)) {
          throw new ApiError(400, 'Variants must be a valid JSON object');
        }
      } catch (e) {
        if (e instanceof ApiError) throw e;
        throw new ApiError(400, 'Invalid variants format');
      }
    }

    // Kategori ve marka kontrolü
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } })
      if (!category) throw new ApiError(404, 'Category not found')
    }

    if (brandId) {
      const brand = await prisma.brand.findUnique({ where: { id: brandId } })
      if (!brand) throw new ApiError(404, 'Brand not found')
    }

    const newProduct = await prisma.product.create({
      data: {
        name: validatedName,
        description: validatedDescription,
        price: validatedPrice,
        discountPrice: validatedDiscountPrice,
        stock: validatedStock,
        categoryId: categoryId ? validateNumber(categoryId, 'Category ID', { integer: true, min: 1 }) : null,
        brandId: brandId ? validateNumber(brandId, 'Brand ID', { integer: true, min: 1 }) : null,
        imageUrl: validatedImageUrl,
        isActive: true
      },
      include: {
        category: true,
        brand: true
      }
    })

    res.status(201).json(newProduct)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, 'Failed to create product')
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, description, price, discountPrice, stock, categoryId, brandId, imageUrl, isActive, productType, variants } = req.body

  try {
    // Ürün var mı kontrolü
    const existingProduct = await prisma.product.findUnique({ where: { id: Number(id) } })
    if (!existingProduct) {
      throw new ApiError(404, 'Product not found')
    }

    // Kategori ve marka kontrolü
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } })
      if (!category) throw new ApiError(404, 'Category not found')
    }

    if (brandId) {
      const brand = await prisma.brand.findUnique({ where: { id: brandId } })
      if (!brand) throw new ApiError(404, 'Brand not found')
    }

    // Validate variants if provided
    let validatedVariants = variants;
    if (variants !== undefined) {
      try {
        validatedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
        if (validatedVariants !== null && (typeof validatedVariants !== 'object' || Array.isArray(validatedVariants))) {
          throw new ApiError(400, 'Variants must be a valid JSON object');
        }
      } catch (e) {
        if (e instanceof ApiError) throw e;
        throw new ApiError(400, 'Invalid variants format');
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price,
        discountPrice,
        stock,
        categoryId,
        brandId,
        imageUrl,
        isActive
      },
      include: {
        category: true,
        brand: true
      }
    })

    res.json(updatedProduct)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, 'Failed to update product')
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

  try {
    // Ürün var mı kontrolü
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
      throw new ApiError(404, 'Ürün bulunamadı');
    }

    // Ürüne ait OrderItem kayıtlarını sil
    await prisma.orderItem.deleteMany({
      where: { productId: Number(id) },
    });

    // Ürünü tamamen sil
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Ürün silinirken hata oluştu');
  }
}



export const getProductsByCategory = async (req: Request, res: Response) => {
  const { categorySlug } = req.params

  try {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            brand: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!category) {
      throw new ApiError(404, 'Category not found')
    }

    res.json(category.products)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, 'Failed to fetch products by category')
  }
}

export const getProductsByBrand = async (req: Request, res: Response) => {
  const { brandSlug } = req.params

  try {
    const brand = await prisma.brand.findUnique({
      where: { slug: brandSlug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            category: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!brand) {
      throw new ApiError(404, 'Brand not found')
    }

    res.json(brand.products)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, 'Failed to fetch products by brand')
  }
}

export const getDiscountedProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        discountPrice: { not: null }
      },
      include: {
        category: true,
        brand: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(products)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, 'Failed to fetch discounted products')
  }
}