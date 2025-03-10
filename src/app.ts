import express, { Express, Request, Response, NextFunction } from 'express';
import { initializeDatabase } from './config/database';
import { setupSwagger } from './config/swagger';
import routes from './routes';
import { errorHandler } from './middlewares/error-handler.middleware';
import { seedDatabase } from './config/seed';

export const setupApp = async (): Promise<Express> => {
    // Create Express application
    const app = express();

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Add request logger for development
    if (process.env.NODE_ENV !== 'production') {
        app.use((req: Request, res: Response, next: NextFunction) => {
            console.log(`${req.method} ${req.path}`);
            next();
        });
    }

    // Health check endpoint
    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
    });

    // API routes
    app.use('/api', routes);

    // Set up Swagger documentation
    setupSwagger(app);

    // Error handling middleware
    app.use(errorHandler);

    // Handle 404 errors
    app.use((req: Request, res: Response) => {
        res.status(404).json({ message: 'Resource not found' });
    });

    // Initialize database
    await initializeDatabase();
    
    if (process.env.NODE_ENV !== 'production') {
      await seedDatabase();
    }

    return app;
};