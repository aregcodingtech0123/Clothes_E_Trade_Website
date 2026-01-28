import { Request, Response } from 'express'
import prisma from '../utils/prisma'
import bcrypt from 'bcryptjs'
import { ApiError } from '../utils/errorHandler'
import { validateString, validateEmail, validateNumber } from '../utils/validation'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true
      }
    })
    res.json(users)
  } catch (error) {
    throw new ApiError(500, 'Failed to fetch users')
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        orders: true
      }
    })

    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    res.json(user)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, 'Failed to fetch user')
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, email, password } = req.body

  try {
    // Validate inputs
    const validatedName = validateString(name, 'Name', { required: false, maxLength: 100, minLength: 2 });
    const validatedEmail = email ? validateEmail(email, 'Email') : undefined;
    
    let updateData: any = {};
    if (validatedName) updateData.name = validatedName;
    if (validatedEmail) updateData.email = validatedEmail;

    if (password) {
      if (typeof password !== 'string' || password.length < 6) {
        throw new ApiError(400, 'Password must be at least 6 characters');
      }
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true
      }
    })

    res.json(updatedUser)
  } catch (error) {
    throw new ApiError(500, 'Failed to update user')
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await prisma.user.delete({
      where: { id: Number(id) }
    })

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    throw new ApiError(500, 'Failed to delete user')
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    // Validate inputs
    const validatedName = validateString(name, 'Name', { required: true, maxLength: 100, minLength: 2 });
    const validatedEmail = validateEmail(email, 'Email');
    
    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters');
    }

    // Email'in benzersizliğini kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedEmail },
    });

    if (existingUser) {
      throw new ApiError(400, 'Bu email adresi zaten kullanılıyor');
    }

    // Parolayı hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcıyı oluştur
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false, // Varsayılan olarak false
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Kullanıcı oluşturulurken hata oluştu');
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      throw new ApiError(401, 'Kullanıcı kimliği bulunamadı');
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new ApiError(404, 'Kullanıcı bulunamadı');
    }

    res.json(user);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Kullanıcı bilgileri alınırken bir hata oluştu');
  }
};