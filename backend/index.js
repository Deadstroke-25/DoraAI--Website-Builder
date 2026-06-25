import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './database/db.js'
import authRoute from './routes/authRoute.js'
import websiteRoute from './routes/websiteRoute.js'
import paymentRoute from './routes/paymentRoute.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet';
import rateLimit from "express-rate-limit";

const app = express()
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        dbStatus: mongoose.connection.readyState,
        hasMongoUri: !!process.env.MONGO_URI,
        dbError: global.dbError || null
    });
});

// rate limiter

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Please try again later."
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

//middleware
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:8000"
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.includes(origin) || 
                          (origin.endsWith('.vercel.app') && origin.includes('dora-ai-website-builder'));
                          
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/website', websiteRoute)
app.use('/api/payment', paymentRoute)


const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:",error);
        process.exit(1);
    }
};

startServer();

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err||err.stack);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err||err.stack);
});

process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    process.exit(0);
});

process.on("SIGINT", () => {
    console.log("SIGINT received. Shutting down gracefully...");
    process.exit(0);
});