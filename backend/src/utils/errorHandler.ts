import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        status: err.statusCode
      }
    })
    return
  }

  console.error('Unexpected error:', err)

  res.status(500).json({
    error: {
      message: 'Internal Server Error',
      status: 500,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err instanceof Error ? err.stack : undefined
      })
    }
  })
}

// Düzeltilmiş notFound handler (next parametresi eklendi)
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  // Hata nesnesi ile iletmek daha iyi
  next(new ApiError(404, 'Not found'))
}