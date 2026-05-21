import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../shared/utils/responseHelper.js';
import logger from '../config/logger.js';

//Custom Errors
export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public errors: unknown[] | null;

    constructor(message: string, statusCode = 500, errors: unknown[] | null = null) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

export class ValidationError extends ApiError {
    constructor(message = 'Validation failed', errors: unknown[] | null = null) {
        super(message, 400, errors);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = 'Access denied') {
        super(message, 403);
    }
}

export class ConflictError extends ApiError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}

//Error Handler Middleware
export const errorHandler = (
    err: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    logger.error({ err }, err.message);

    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors: unknown[] | null = null;

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired';
    } else {
        // Handle MySQL driver errors
        const mysqlErr = err as Error & { errno?: number; code?: string };
        if (mysqlErr.errno === 1062 || mysqlErr.code === 'ER_DUP_ENTRY') {
            statusCode = 409;
            message = 'Duplicate entry — resource already exists';
        } else if (mysqlErr.errno === 1452 || mysqlErr.code === 'ER_NO_REFERENCED_ROW_2') {
            statusCode = 400;
            message = 'Foreign key constraint failed — referenced record not found';
        } else if (mysqlErr.errno === 1451 || mysqlErr.code === 'ER_ROW_IS_REFERENCED_2') {
            statusCode = 409;
            message = 'Cannot delete — record is referenced by other data';
        }
    }

    if (process.env.NODE_ENV === 'production' && !(err instanceof ApiError)) {
        message = 'An unexpected error occurred';
        errors = null;
    }

    return errorResponse(res, message, statusCode, errors);
};

//404 Not Found Handler
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
    return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
