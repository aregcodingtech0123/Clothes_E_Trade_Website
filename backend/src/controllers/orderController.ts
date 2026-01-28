import { RequestHandler } from 'express';
import prisma from '../utils/prisma';
import { generateOrderNumber } from '../utils/generateOrderNumber';
import { ApiError } from '../utils/errorHandler';
import { OrderWithItems } from '../types/express';
import { Decimal } from '@prisma/client/runtime/library';
import { validateString, validateNumber } from '../utils/validation';

// Her bir controller fonksiyonu RequestHandler tipinde olmalı
// Her fonksiyon standard RequestHandler tipi kullanıyor - void dönüş tipi
export const createOrder: RequestHandler = async (req, res, next) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.sendError(401, 'Authentication required');
    return;
  }

  try {
    // Validate shipping address
    if (!shippingAddress || typeof shippingAddress !== 'object') {
      throw new ApiError(400, 'Shipping address is required');
    }

    const validatedShippingAddress = {
      fullName: validateString(shippingAddress.fullName, 'Full Name', { required: true, maxLength: 100 }),
      address: validateString(shippingAddress.address, 'Address', { required: true, maxLength: 500 }),
      city: validateString(shippingAddress.city, 'City', { required: true, maxLength: 100 }),
      phone: validateString(shippingAddress.phone, 'Phone', { required: true, maxLength: 20 })
    };

    // Tip güvenliği için item arayüzü
    interface OrderItemRequest {
      productId: number;
      quantity: number;
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, 'Items array is required and must not be empty');
    }

    const orderItems = items.map(item => ({
      productId: validateNumber(item.productId, 'Product ID', { required: true, integer: true, min: 1 }),
      quantity: validateNumber(item.quantity, 'Quantity', { required: true, integer: true, min: 1 }),
      variant: item.variant || null // Include variant if provided
    }));
    
    // Ürünleri getir
    const products = await prisma.product.findMany({
      where: {
        id: { in: orderItems.map(item => item.productId) },
        isActive: true
      }
    });

    // Validasyonlar
    if (products.length !== orderItems.length) {
      throw new ApiError(400, 'Some products not found or inactive');
    }

    for (const item of orderItems) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for product ${product?.name}`);
      }
    }
    
    // Toplam tutarı hesapla
    const totalAmount = orderItems.reduce((sum, item) => {
      const product = products.find(p => p.id == item.productId)!;
      return sum + (Number(product.price) * item.quantity);
    }, 0);
    
    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber: generateOrderNumber(),
        totalAmount: new Decimal(totalAmount), // Decimal dönüşümü eklendi
        status: 'processing',
        paymentMethod: validateString(paymentMethod, 'Payment Method', { required: false, maxLength: 50 }) || 'credit_card',
        paymentStatus: 'pending',
        shippingAddress: JSON.stringify(validatedShippingAddress), // JSON stringify eklendi
        orderItems: {
          create: orderItems.map(item => {
            const product = products.find(p => p.id === item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: new Decimal(product.price.toString()), // Fiyat Decimal'e çevrildi
              variant: item.variant || null // Store variant information
            };
          })
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    }) as OrderWithItems;
    
    // Stok güncelleme
    await prisma.$transaction(
      orderItems.map(item => 
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      )
    );
    
    res.sendResponse(201, order);
  } catch (error) {
    next(error);
  }
};


export const getAllOrders: RequestHandler = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: { product: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.sendResponse(200, orders);
  } catch (error) {
    next(error);
  }
};


export const getOrderById: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    }) as OrderWithItems | null;

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (!req.user?.isAdmin && order.userId !== userId) {
      throw new ApiError(403, 'Unauthorized access to this order');
    }

    res.sendResponse(200, order);
  } catch (error) {
    next(error);
  }
};

export const getUserOrders: RequestHandler = async (req, res, next) => {
  const userId = req.user?.id;
  const { status } = req.query;

  if (!userId) {
    res.sendError(401, 'Authentication required');
    return;
  }

  try {
    const whereClause: any = { userId };
    if (status) whereClause.status = status as string;

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }) as OrderWithItems[];

    res.status(200).json(orders);
  } catch (error) {
    console.error(error); // Hata detayını logla
    res.status(500).json({
      error: {
        message: 'Internal Server Error',
        status: 500
      }
    });
  }
};

export const updateOrderStatus: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user?.id;

  try {
    // Frontend ile uyumlu durum listesi
    const validStatuses = ['processing', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid order status');
    }

    // Önce siparişin var olduğunu ve kullanıcının yetkisini kontrol et
    const existingOrder = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        orderItems: true
      }
    });

    if (!existingOrder) {
      throw new ApiError(404, 'Order not found');
    }

    if (!req.user?.isAdmin && existingOrder.userId !== userId) {
      throw new ApiError(403, 'Unauthorized to update this order');
    }

    // Frontend'deki 'completed' durumunu backend'deki 'delivered' ile eşleştir
    const backendStatus = status === 'completed' ? 'delivered' : status;

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: backendStatus },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    }) as OrderWithItems;

    if (status === 'cancelled') {
      await prisma.$transaction(
        existingOrder.orderItems.map(item => 
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          })
        )
      );
    }

    // Response'da frontend'in beklediği format ile gönder
    const responseOrder = {
      ...order,
      status: order.status === 'delivered' ? 'completed' : order.status
    };

    res.sendResponse(200, responseOrder);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        orderItems: true
      }
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (!req.user?.isAdmin && order.userId !== userId) {
      throw new ApiError(403, 'Unauthorized to delete this order');
    }

    const activeItems = await prisma.orderItem.findMany({
      where: {
        productId: { in: order.orderItems.map(item => item.productId) },
        order: {
          status: { not: 'cancelled' }
        }
      }
    });

    if (activeItems.length > 0) {
      throw new ApiError(400, 'Cannot delete order with active items');
    }

    await prisma.$transaction([
      ...order.orderItems.map(item =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        })
      ),
      prisma.order.delete({
        where: { id: Number(id) }
      })
    ]);

    res.sendResponse(200, { message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getLastCompletedOrderDeliveryInfo: RequestHandler = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    res.sendError(401, 'Authentication required');
    return;
  }

  try {
    const lastOrder = await prisma.order.findFirst({
      where: {
        userId,
        status: { in: ['completed', 'delivered'] }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        shippingAddress: true
      }
    });

    if (!lastOrder) {
      res.sendResponse(200, { shippingAddress: null });
      return;
    }

    const shippingAddress = typeof lastOrder.shippingAddress === 'string' 
      ? JSON.parse(lastOrder.shippingAddress) 
      : lastOrder.shippingAddress;

    res.sendResponse(200, { shippingAddress });
  } catch (error) {
    next(error);
  }
};