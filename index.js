import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import dotenv from "dotenv";
import AuthRoutes from './routes/Auth.js';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.static('public'))
app.use(express.json());
app.use(cookieParser());

// Correct CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        // 'https://frontend-dot-ayurguide-451219.uc.r.appspot.com'
        'https://mydva-deployment-5wkf7skpp-ritika-gaurs-projects.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/auth", AuthRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
