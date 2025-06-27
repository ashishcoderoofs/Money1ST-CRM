import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Money1st CRM API',
      version: '1.0.0',
      description: 'A comprehensive CRM API for Money1st with role-based access control',
      contact: {
        name: 'Money1st Development Team',
        email: 'dev@money1st.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.money1st.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['consultantId', 'entryDate', 'firstName', 'lastName', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User unique identifier'
            },
            consultantId: {
              type: 'string',
              description: 'Unique consultant identifier',
              example: 'CONS001'
            },
            entryDate: {
              type: 'string',
              format: 'date',
              description: 'Date when user joined'
            },
            position: {
              type: 'string',
              description: 'User position/title'
            },
            status: {
              type: 'string',
              enum: ['Active', 'Inactive'],
              default: 'Active'
            },
            firstName: {
              type: 'string',
              maxLength: 50,
              example: 'John'
            },
            middleInitial: {
              type: 'string',
              maxLength: 5,
              example: 'D'
            },
            lastName: {
              type: 'string',
              maxLength: 50,
              example: 'Doe'
            },
            suffix: {
              type: 'string',
              maxLength: 10,
              example: 'Jr.'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            role: {
              type: 'string',
              enum: ['Admin', 'Field Builder', 'Field Trainer', 'Sr. BMA', 'BMA', 'IBA'],
              default: 'Field Builder',
              description: 'User role with hierarchy: Admin > Field Builder > Field Trainer > Sr. BMA > BMA > IBA'
            },
            isActive: {
              type: 'boolean',
              default: true
            },
            lastLogin: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@money1st.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            }
          }
        },
        CreateUserRequest: {
          type: 'object',
          required: ['consultantId', 'entryDate', 'firstName', 'lastName', 'email', 'password'],
          properties: {
            consultantId: {
              type: 'string',
              example: 'CONS001'
            },
            entryDate: {
              type: 'string',
              format: 'date',
              example: '2025-01-01'
            },
            firstName: {
              type: 'string',
              example: 'John'
            },
            lastName: {
              type: 'string',
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            role: {
              type: 'string',
              enum: ['Admin', 'Field Builder', 'Field Trainer', 'Sr. BMA', 'BMA', 'IBA'],
              default: 'Field Builder'
            }
          }
        },
        BulkUpdateRequest: {
          type: 'object',
          required: ['userIds', 'updates'],
          properties: {
            userIds: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['60f1b2b5c8e4f123456789ab', '60f1b2b5c8e4f123456789ac']
            },
            updates: {
              type: 'object',
              properties: {
                role: {
                  type: 'string',
                  enum: ['Admin', 'Field Builder', 'Field Trainer', 'Sr. BMA', 'BMA', 'IBA']
                },
                isActive: {
                  type: 'boolean'
                }
              }
            }
          }
        },
        DashboardStats: {
          type: 'object',
          properties: {
            totalUsers: {
              type: 'number',
              example: 150
            },
            activeUsers: {
              type: 'number',
              example: 140
            },
            inactiveUsers: {
              type: 'number',
              example: 10
            },
            recentUsers: {
              type: 'number',
              example: 25
            },
            roleDistribution: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    example: 'Field Builder'
                  },
                  count: {
                    type: 'number',
                    example: 45
                  }
                }
              }
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            error: {
              type: 'string',
              example: 'Error message'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts'
  ]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Money1st CRM API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true
    }
  }));

  // JSON endpoint for the OpenAPI spec
  app.get('/api-docs.json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export default specs;
