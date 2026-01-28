// src/types/express.d.ts

import { User, Product, Order, OrderItem, Category, Brand } from '@prisma/client';

declare global {
  namespace Express {
    // Request nesnesine özel eklemeler
    interface Request {
      user?: SafeUser; // Authenticate middleware'den gelen kullanıcı
    }

    // Response nesnesine yardımcı metodlar
    interface Response {
      success: (data: any, status?: number) => Response;
      error: (message: string, status?: number, details?: any) => Response;
      sendResponse(status: number, data: any): Response;
      sendError(status: number, message: string): Response;
    }
  }
}
export type CustomRequestHandler = RequestHandler;
export interface OrderWithItems extends Order {
  orderItems: (OrderItem & {
    product: Product;
  })[];
  user?: {
    id: number;
    name: string;
    email: string;
  };
}
export interface CustomResponse extends Response {
  sendResponse(status: number, data: any): Response;
  sendError(status: number, message: string): Response;
}
// Hassas bilgileri çıkartılmış kullanıcı tipi
export type SafeUser = Omit<User, 'password' | 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

// Ürün ilişkileriyle genişletilmiş sipariş tipi
export type OrderWithItems = Order & {
  orderItems: Array<
    OrderItem & {
      product: Product;
    }
  >;
  user?: SafeUser;
};

// Kategori ilişkileriyle genişletilmiş ürün tipi
export type ProductWithRelations = Product & {
  category?: Category;
  brand?: Brand;
};

// API cevabı için standart yapı
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Hata tipi
export interface AppError {
  message: string;
  statusCode: number;
  code?: string;
  details?: any;
}

// Pagination için temel tip
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}