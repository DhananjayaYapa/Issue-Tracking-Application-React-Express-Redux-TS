import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Issue Tracker API',
            version: '2.0.0',
            description:
                'RESTful API for Issue Tracking Application. Manage issues, users, and reports.',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT ?? 5000}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token',
                },
            },
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: { type: 'object', nullable: true },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
                ApiError: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string' },
                                    message: { type: 'string' },
                                },
                            },
                            nullable: true,
                        },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
                PaginatedResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                items: { type: 'array', items: { type: 'object' } },
                                total: { type: 'integer' },
                                page: { type: 'integer' },
                                limit: { type: 'integer' },
                                totalPages: { type: 'integer' },
                            },
                        },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        tags: [
            { name: 'Auth', description: 'Authentication & registration' },
            { name: 'Issues', description: 'Issue management' },
            { name: 'Users', description: 'User management (Admin only)' },
        ],
    },
    apis: ['./src/modules/**/*.routes.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
