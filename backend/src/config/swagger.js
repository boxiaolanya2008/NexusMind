import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NexusMind AI Model Proxy API',
      version: '1.0.0',
      description: 'A unified AI model proxy service that aggregates multiple AI model providers',
      contact: {
        name: 'NexusMind Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
            balance: { type: 'number' },
            is_admin: { type: 'boolean' }
          }
        },
        Model: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            display_name: { type: 'string' },
            provider: { type: 'string' },
            input_price: { type: 'number' },
            output_price: { type: 'number' },
            intelligence_level: { type: 'integer' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
