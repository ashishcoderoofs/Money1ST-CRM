import * as dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

// Import routes
import authRoutes from './src/routes/authRoutes';
import userRoutes from './src/routes/userRoutes';
import adminRoutes from './src/routes/adminRoutes';
import attachmentRoutes from './src/routes/attachmentRoutes';
import securiaRoutes from './src/routes/securiaRoutes';
import consultantRoutes from './src/routes/consultantRoutes';

// Import middleware
import { errorHandler } from './src/middleware/errorHandler';
import logger from './utils/logger';

// Import Swagger configuration
import { setupSwagger } from './src/config/swagger';

// Initialize app
const app: Application = express();

// ✅ Middleware first
app.use(helmet());
// Fix CORS to allow frontend on port 8081
app.use(cors({ 
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'], 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// ✅ Apply rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ✅ All routes after middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/securia', securiaRoutes);
app.use('/api/consultants', consultantRoutes);

// ✅ Swagger setup
setupSwagger(app);

// ✅ Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ✅ Database connection
const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// ✅ Error & 404 handlers
app.use(errorHandler);
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});

export default app;
