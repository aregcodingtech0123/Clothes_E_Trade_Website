import { Request, Response, NextFunction } from 'express';

export const responseEnhancer = (req: Request, res: Response, next: NextFunction) => {
  res.sendResponse = function (statusCode: number, data: any) {
    return res.status(statusCode).json({
      success: true,
      data
    });
  };

  res.sendError = function (statusCode: number, message: string) {
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        status: statusCode
      }
    });
  };

  next();
};
