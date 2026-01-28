// src/controllers/contactController.ts
import { RequestHandler } from 'express';
import prisma from '../utils/prisma';
import { ApiError } from '../utils/errorHandler';

interface ContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FilterOptions {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export const createContactMessage: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, subject, message }: ContactMessageData = req.body;
    
    if (!name || !email || !subject || !message) {
      throw new ApiError(400, 'All fields are required');
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message
      }
    });
    
    res.sendResponse(201, newMessage);
  } catch (error) {
    next(error);
  }
};

export const getContactMessages: RequestHandler = async (req, res, next) => {
  try {
    const { name, startDate, endDate }: FilterOptions = req.query;
    
    const where: any = {};
    
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive'
      };
    }
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    } else if (startDate) {
      where.createdAt = {
        gte: new Date(startDate)
      };
    } else if (endDate) {
      where.createdAt = {
        lte: new Date(endDate)
      };
    }
    
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.sendResponse(200, messages);
  } catch (error) {
    next(error);
  }
};

export const getMessageById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await prisma.contactMessage.findUnique({
      where: { id: Number(id) }
    });

    if (!message) {
      throw new ApiError(404, 'Message not found');
    }

    res.sendResponse(200, message);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({
      where: { id: Number(id) }
    });

    res.sendResponse(204, {});
  } catch (error) {
    next(error);
  }
};