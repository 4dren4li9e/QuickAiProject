import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

const app = express()

// Handle Cloudinary connection with error handling
try {
    await connectCloudinary()
    console.log('Cloudinary connected successfully')
} catch (error) {
    console.error('Cloudinary connection error:', error.message)
    console.log('Server will continue without Cloudinary...')
}

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res)=>res.send('Server is Live!'))

// Apply requireAuth middleware only to protected routes
app.use('/api', requireAuth())

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('Server is running on port', PORT);
    console.log(`Server URL: http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});