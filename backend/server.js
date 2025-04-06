import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors'

import { connectDB } from './config/db.js';

const app = express();
const port = process.env.PORT;

//middlewares
app.use(express.json())

connectDB();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://ouraurahealth.netlify.app'],
    credentials: true
}))

import userRoute from './routes/userRoutes.js'
import adminRoute from './routes/adminRoutes.js'
import doctorRoute from './routes/doctorRoutes.js'
app.use('/api/v1/user', userRoute)
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/doctor', doctorRoute)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});