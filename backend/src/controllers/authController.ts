import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { validateString, validateEmail } from '../utils/validation';
import { ApiError } from '../utils/errorHandler';

import dotenv from 'dotenv';
dotenv.config();
import { JWT_SECRET } from '../config';

// JWT_SECRET için bir ortam değişkeni kullanmak en iyi pratiktir.
// Ortam değişkeni tanımlı değilse, geliştirme için varsayılan bir anahtar kullanılır.



export const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate and sanitize inputs
    const validatedName = validateString(name, 'Name', { required: true, maxLength: 100, minLength: 2 });
    const validatedEmail = validateEmail(email, 'Email');
    
    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters');
    }

    // Parolayı hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcıyı veritabanına kaydet
    const user = await prisma.user.create({
      data: {
        name: validatedName,
        email: validatedEmail,
        password: hashedPassword,
        isAdmin: false, // Varsayılan olarak isAdmin false atanır
      },
    });

    // Başarılı kayıt durumunda kullanıcı ID'si ve email'i döndür
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (error: any) {
    // Hata yönetimi
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return next(new ApiError(409, 'Email already in use.'));
    }
    console.error('Registration error:', error);
    return next(new ApiError(500, 'Registration failed due to an internal server error.'));
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    const validatedEmail = validateEmail(email, 'Email');
    
    if (!password || typeof password !== 'string') {
      throw new ApiError(400, 'Password is required');
    }

    // Kullanıcıyı email ile veritabanında bul
    const user = await prisma.user.findUnique({ where: { email: validatedEmail } });

    // Kullanıcı bulunamazsa veya parola eşleşmezse hata döndür
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // JWT oluştur
    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' } // Token geçerlilik süresi
    );

    // Başarılı giriş durumunda token'ı ve kullanıcı bilgilerini döndür
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return next(error);
    }
    console.error('Login error:', error);
    return next(new ApiError(500, 'Login failed due to an internal server error.'));
  }
};
