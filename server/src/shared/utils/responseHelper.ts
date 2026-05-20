import { Response } from 'express';

// Success Responses
export const successResponse = (
    res: Response,
    data: unknown = null,
    message = 'Success',
    statusCode = 200,
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
    });
};

export const createdResponse = (
    res: Response,
    data: unknown,
    message = 'Resource created successfully',
) => {
    return successResponse(res, data, message, 201);
};

export const noContentResponse = (res: Response) => {
    return res.status(204).send();
};

//Error Responses
export const errorResponse = (
    res: Response,
    message = 'An error occurred',
    statusCode = 500,
    errors: unknown[] | null = null,
) => {
    const response: Record<string, unknown> = {
        success: false,
        message,
        timestamp: new Date().toISOString(),
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

//Shorthand Error Responses
export const notFoundResponse = (res: Response, message = 'Resource not found') => {
    return errorResponse(res, message, 404);
};

export const unauthorizedResponse = (res: Response, message = 'Unauthorized access') => {
    return errorResponse(res, message, 401);
};

export const forbiddenResponse = (res: Response, message = 'Access denied') => {
    return errorResponse(res, message, 403);
};
