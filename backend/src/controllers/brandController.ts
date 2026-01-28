import { Request, Response } from 'express'
import prisma from '../utils/prisma'
import { ApiError } from '../utils/errorHandler'

export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        products: {
          where: { isActive: true },
          take: 5
        }
      }
    })
    res.json(brands)
  } catch (error) {
    throw new ApiError(500, 'Failed to fetch brands')
  }
}

export const getBrandBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params
  try {
    const brand = await prisma.brand.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true }
        }
      }
    })

    if (!brand) {
      throw new ApiError(404, 'Brand not found')
    }

    res.json(brand)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, 'Failed to fetch brand')
  }
}

export const createBrand = async (req: Request, res: Response) => {
  const { name, slug } = req.body

  try {
    const newBrand = await prisma.brand.create({
      data: { name, slug }
    })
    res.status(201).json(newBrand)
  } catch (error) {
    throw new ApiError(500, 'Failed to create brand')
  }
}

export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, slug } = req.body

  try {
    const updatedBrand = await prisma.brand.update({
      where: { id: Number(id) },
      data: { name, slug }
    })
    res.json(updatedBrand)
  } catch (error) {
    throw new ApiError(500, 'Failed to update brand')
  }
}

export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await prisma.brand.delete({
      where: { id: Number(id) }
    })
    res.json({ message: 'Brand deleted successfully' })
  } catch (error) {
    throw new ApiError(500, 'Failed to delete brand')
  }
}