import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database.js';

// --- Global Middleware Imports ---
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';


// --- Route Imports ---
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js';
import chatRoutes from './routes/chatbotRoute.js';
import conversionRoutes from './routes/conversionRoute.js';
import historyRoutes from './routes/historyRoute.js';
import adminRoutes from './routes/adminRoute.js';


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// --- [CRITICAL] GLOBAL MIDDLEWARE LAYER - CORRECT ORDER ---

// ✅ 1. CORS Configuration (The Bouncer at the Door)
// MUST be one of the very first middleware to run. It handles preflight requests.
const allowedOrigins = [
  'http://localhost:5173', 'http://localhost:4173',
  process.env.FRONTEND_URL 
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    console.log(`CORS request from origin: ${origin}`);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by the CORS policy.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true,
};
app.use(cors(corsOptions));


// ✅ 2. Security Headers (The Metal Detector)
// Now that CORS has approved the origin, apply other security headers.
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: {policy: 'same-origin-allow-popups'},
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://apis.google.com", "https://accounts.google.com/"],
        styleSrc: ["'self'", "'unsafe-inline'","https://accounts.google.com/"],
        imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"],
        frameSrc: ["'self'", "https://accounts.google.com/"],
        connectSrc: ["'self'", "https://accounts.google.com/"],
      },
    },
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
    },
  })
);


// ✅ 3. SANITIZE INPUT — Moved up!
app.use(mongoSanitize());

// ✅ 4. Body Parsing
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// ✅ 5. Cookie & Logging
app.use(cookieParser());
app.use(morgan('dev'));

// ✅ 6. Rate Limiting
// Apply rate limiting before your routes to protect them.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests have been made from this IP, please try again later.' }
});
app.use('/api', apiLimiter);


// ✅ 7. Mounting The Application Routes (The Bartender)
// Finally, direct the request to the correct route handler.
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/convert', conversionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);

export default app;