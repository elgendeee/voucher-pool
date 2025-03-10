import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

// Function to combine Swagger JSON files
const combineSwaggerJson = () => {
  // Base Swagger document
  const baseSwagger = {
    openapi: '3.0.0',
    info: {
      title: 'Voucher Pool API',
      version: '1.0.0',
      description: 'A Voucher Pool API for managing customer vouchers',
      contact: {
        name: 'API Support',
        email: 'support@voucherpool.com'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      schemas: {}
    },
    paths: {},
    tags: [
      {
        name: 'Customers',
        description: 'Endpoints for managing customers'
      },
      {
        name: 'Special Offers',
        description: 'Endpoints for managing special offers'
      },
      {
        name: 'Vouchers',
        description: 'Endpoints for managing vouchers'
      }
    ]
  };

  // Common components from config
  const commonSwaggerPath = path.join(__dirname, 'swagger-common.json');
  if (fs.existsSync(commonSwaggerPath)) {
    try {
      const commonSwagger = JSON.parse(fs.readFileSync(commonSwaggerPath, 'utf8'));
      if (commonSwagger.components && commonSwagger.components.schemas) {
        Object.assign(baseSwagger.components.schemas, commonSwagger.components.schemas);
      }
    } catch (error) {
      console.error('Error reading common swagger file:', error);
    }
  }

  // Load component-specific Swagger files
  const componentDirs = [
    { path: '../components/customer/swagger.json', tag: 'Customers' },
    { path: '../components/special-offer/swagger.json', tag: 'Special Offers' },
    { path: '../components/voucher/swagger.json', tag: 'Vouchers' }
  ];

  componentDirs.forEach(component => {
    const componentSwaggerPath = path.join(__dirname, component.path);
    if (fs.existsSync(componentSwaggerPath)) {
      try {
        const componentSwagger = JSON.parse(fs.readFileSync(componentSwaggerPath, 'utf8'));
        
        // Merge schemas
        if (componentSwagger.components && componentSwagger.components.schemas) {
          Object.assign(baseSwagger.components.schemas, componentSwagger.components.schemas);
        }
        
        // Merge paths
        if (componentSwagger.paths) {
          Object.assign(baseSwagger.paths, componentSwagger.paths);
        }
      } catch (error) {
        console.error(`Error reading swagger file for ${component.tag}:`, error);
      }
    } else {
      console.warn(`Swagger file not found for ${component.tag}: ${componentSwaggerPath}`);
    }
  });

  return baseSwagger;
};

const options = {
  customSiteTitle: "Voucher Pool API Documentation",
}

export const setupSwagger = (app: Express): void => {
  try {
    const combinedSwagger = combineSwaggerJson();
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(combinedSwagger, options));
    console.log('Swagger documentation available at /api-docs');
  } catch (error) {
    console.error('Error setting up Swagger:', error);
  }
};