import { Request, Response } from 'express'
import prisma from '../utils/prisma'
import { ApiError } from '../utils/errorHandler'

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          where: { isActive: true },
          take: 5
        }
      }
    })
    res.json(categories)
  } catch (error) {
    throw new ApiError(500, 'Failed to fetch categories')
  }
}

export const getCategoryBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true }
        }
      }
    })

    if (!category) {
      throw new ApiError(404, 'Category not found')
    }

    res.json(category)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, 'Failed to fetch category')
  }
}

export const createCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body

  try {
    const newCategory = await prisma.category.create({
      data: { name, slug }
    })
    res.status(201).json(newCategory)
  } catch (error) {
    throw new ApiError(500, 'Failed to create category')
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, slug } = req.body

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, slug }
    })
    res.json(updatedCategory)
  } catch (error) {
    throw new ApiError(500, 'Failed to update category')
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await prisma.category.delete({
      where: { id: Number(id) }
    })
    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    throw new ApiError(500, 'Failed to delete category')
  }
}