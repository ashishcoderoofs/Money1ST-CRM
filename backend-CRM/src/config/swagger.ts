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
              enum: ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'],
              default: 'Field Builder',
              description: 'User role with hierarchy: Admin > Field Builder > Field Trainer > Senior BMA > BMA > IBA'
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
              enum: ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'],
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
                  enum: ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA']
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
        },
        // Securia Schemas
        Consultant: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'phone', 'position'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated consultant ID'
            },
            firstName: {
              type: 'string',
              maxLength: 50,
              example: 'John'
            },
            lastName: {
              type: 'string',
              maxLength: 50,
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Unique email address',
              example: 'john.doe@example.com'
            },
            phone: {
              type: 'string',
              pattern: '^\\+?[\\d\\s\\-\\(\\)]+',
              example: '+1-555-0123'
            },
            position: {
              type: 'string',
              enum: ['Admin', 'BMA', 'Senior BMA', 'Unit Manager', 'Assistant Unit Manager', 'Agency Manager', 'Assistant Agency Manager', 'Regional Manager', 'Assistant Regional Manager'],
              example: 'BMA'
            },
            title: {
              type: 'string',
              enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'],
              example: 'Mr.'
            },
            middleName: {
              type: 'string',
              maxLength: 50,
              example: 'Michael'
            },
            suffix: {
              type: 'string',
              enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'],
              example: 'Jr.'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              example: '1985-05-15'
            },
            address: {
              type: 'object',
              properties: {
                street: {
                  type: 'string',
                  example: '123 Main St'
                },
                city: {
                  type: 'string',
                  example: 'New York'
                },
                state: {
                  type: 'string',
                  example: 'NY'
                },
                zipCode: {
                  type: 'string',
                  example: '10001'
                },
                country: {
                  type: 'string',
                  example: 'USA'
                }
              }
            },
            personalEmail: {
              type: 'string',
              format: 'email',
              example: 'john.personal@email.com'
            },
            cellPhone: {
              type: 'string',
              example: '+1-555-0124'
            },
            homePhone: {
              type: 'string',
              example: '+1-555-0125'
            },
            workPhone: {
              type: 'string',
              example: '+1-555-0126'
            },
            emergencyContact: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Jane Doe'
                },
                relationship: {
                  type: 'string',
                  example: 'Spouse'
                },
                phone: {
                  type: 'string',
                  example: '+1-555-0127'
                }
              }
            },
            hireDate: {
              type: 'string',
              format: 'date',
              example: '2023-01-15'
            },
            employeeId: {
              type: 'string',
              example: 'EMP001'
            },
            department: {
              type: 'string',
              example: 'Sales'
            },
            supervisor: {
              type: 'string',
              description: 'Reference to supervisor consultant ID'
            },
            territoryAssigned: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['NYC', 'Brooklyn']
            },
            licenses: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    example: 'Life Insurance'
                  },
                  number: {
                    type: 'string',
                    example: 'LIC123456'
                  },
                  state: {
                    type: 'string',
                    example: 'NY'
                  },
                  issueDate: {
                    type: 'string',
                    format: 'date'
                  },
                  expirationDate: {
                    type: 'string',
                    format: 'date'
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'expired', 'suspended'],
                    default: 'active'
                  }
                }
              }
            },
            certifications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'CFP'
                  },
                  issuingOrganization: {
                    type: 'string',
                    example: 'CFP Board'
                  },
                  issueDate: {
                    type: 'string',
                    format: 'date'
                  },
                  expirationDate: {
                    type: 'string',
                    format: 'date'
                  },
                  certificateNumber: {
                    type: 'string',
                    example: 'CFP123456'
                  }
                }
              }
            },
            commissionStructure: {
              type: 'object',
              properties: {
                baseRate: {
                  type: 'number',
                  example: 0.05
                },
                bonusRate: {
                  type: 'number',
                  example: 0.02
                },
                overrideRate: {
                  type: 'number',
                  example: 0.01
                }
              }
            },
            performanceMetrics: {
              type: 'object',
              properties: {
                salesTarget: {
                  type: 'number',
                  example: 100000
                },
                currentSales: {
                  type: 'number',
                  example: 75000
                },
                recruitsTarget: {
                  type: 'number',
                  example: 5
                },
                currentRecruits: {
                  type: 'number',
                  example: 3
                }
              }
            },
            contractStatus: {
              type: 'string',
              enum: ['active', 'probation', 'suspended', 'terminated'],
              default: 'active'
            },
            isActive: {
              type: 'boolean',
              default: true
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
        SecuriaClient: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'phone', 'address', 'dateOfBirth', 'ssn', 'consultantId', 'financialInfo'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated client ID'
            },
            firstName: {
              type: 'string',
              maxLength: 50,
              example: 'Jane'
            },
            lastName: {
              type: 'string',
              maxLength: 50,
              example: 'Smith'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Unique email address',
              example: 'jane.smith@example.com'
            },
            phone: {
              type: 'string',
              pattern: '^\\+?[\\d\\s\\-\\(\\)]+',
              example: '+1-555-0456'
            },
            address: {
              type: 'object',
              required: ['street', 'city', 'state', 'zipCode', 'country'],
              properties: {
                street: {
                  type: 'string',
                  maxLength: 200,
                  example: '123 Main St'
                },
                city: {
                  type: 'string',
                  maxLength: 100,
                  example: 'Anytown'
                },
                state: {
                  type: 'string',
                  maxLength: 50,
                  example: 'CA'
                },
                zipCode: {
                  type: 'string',
                  pattern: '^\\d{5}(-\\d{4})?$',
                  example: '12345'
                },
                country: {
                  type: 'string',
                  maxLength: 50,
                  default: 'USA',
                  example: 'USA'
                }
              }
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              example: '1985-06-15'
            },
            ssn: {
              type: 'string',
              description: 'Encrypted SSN (stored securely)',
              example: '123-45-6789'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              default: 'active'
            },
            consultantId: {
              type: 'string',
              description: 'Reference to assigned consultant',
              example: '60f1b2b5c8e4f123456789ab'
            },
            financialInfo: {
              type: 'object',
              required: ['annualIncome', 'netWorth', 'investmentGoals', 'riskTolerance'],
              properties: {
                annualIncome: {
                  type: 'number',
                  minimum: 0,
                  example: 100000
                },
                netWorth: {
                  type: 'number',
                  example: 500000
                },
                investmentGoals: {
                  type: 'string',
                  maxLength: 1000,
                  example: 'Retirement planning and wealth preservation'
                },
                riskTolerance: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  example: 'medium'
                }
              }
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
        SecuriaAuditLog: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Audit log ID'
            },
            userId: {
              type: 'string',
              description: 'User who performed the action'
            },
            userEmail: {
              type: 'string',
              description: 'Email of the user who performed the action'
            },
            action: {
              type: 'string',
              description: 'Action performed',
              example: 'CREATE_CLIENT'
            },
            resource: {
              type: 'string',
              description: 'Resource type',
              example: 'client'
            },
            resourceId: {
              type: 'string',
              description: 'ID of the affected resource'
            },
            ipAddress: {
              type: 'string',
              description: 'IP address of the user',
              example: '192.168.1.1'
            },
            userAgent: {
              type: 'string',
              description: 'User agent string'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'When the action occurred'
            },
            details: {
              type: 'object',
              description: 'Additional details about the action'
            }
          }
        },
        SecuriaDashboardStats: {
          type: 'object',
          properties: {
            totalConsultants: {
              type: 'number',
              example: 25
            },
            activeConsultants: {
              type: 'number',
              example: 23
            },
            totalClients: {
              type: 'number',
              example: 150
            },
            activeClients: {
              type: 'number',
              example: 142
            },
            totalRevenue: {
              type: 'number',
              example: 2500000
            },
            monthlyGrowth: {
              type: 'number',
              example: 15.5
            },
            recentActivity: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string'
                  },
                  type: {
                    type: 'string',
                    example: 'client_created'
                  },
                  description: {
                    type: 'string',
                    example: 'New client Jane Smith created'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        SecuriaApiResponse: {
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
            data: {
              type: 'object',
              description: 'Response data'
            },
            error: {
              type: 'string',
              example: 'Error message'
            }
          }
        },
        SecuriaPagination: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              example: 1
            },
            pages: {
              type: 'number',
              example: 5
            },
            total: {
              type: 'number',
              example: 50
            },
            hasNext: {
              type: 'boolean',
              example: true
            },
            hasPrev: {
              type: 'boolean',
              example: false
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
