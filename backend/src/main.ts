import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    // Global API prefix
    app.setGlobalPrefix('api');

    // CORS
    const isProduction = process.env.NODE_ENV === 'production';
    const allowedOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
      : [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://127.0.0.1:5173',
          'http://127.0.0.1:5174',
          'https://barangay-portal-hazel.vercel.app',
          // Add your production frontend URL here when deployed
          // 'https://your-frontend-domain.vercel.app',
        ];

    app.enableCors({
      origin: isProduction
        ? (origin, callback) => {
            // Allow requests with no origin (mobile apps, etc.)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
              callback(null, true);
            } else {
              console.warn(`CORS blocked origin: ${origin}`);
              callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
          }
        : true, // Allow all origins in development
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // Health check
    app.getHttpAdapter().get('/api/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    await app.init();
  }

  return app;
}

// For Vercel serverless functions
const handler = async function(req: any, res: any) {
  // Simple test response
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ status: 'OK', message: 'Serverless function working', timestamp: new Date().toISOString() });
};

export default handler;

// For local development
if (require.main === module) {
  bootstrap().then((app) => {
    const port = process.env.PORT || 5000;
    app.listen(port);
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📊 Health check: http://localhost:${port}/api/health`);
  });
}
