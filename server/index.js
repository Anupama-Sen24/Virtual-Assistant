import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './configs/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import userRouter from './routes/user.routes.js';



const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://virtual-assistant-1-5442.onrender.com',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)




app.listen(port, () => {
    connectDB();
    console.log(`Server started on port ${port}`);
});
    
    
