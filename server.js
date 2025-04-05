import express from 'express';
import cors from 'cors';

import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
// import "dotenv/config"
import dotenv from "dotenv";
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import mongoose from 'mongoose';

//app config
dotenv.config();
const app = express();


//middleware
app.use(express.json());
app.use(cors({
    origin: "https://food-del-frontend-tybx.onrender.com", 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    credentials: true
  }));


const connectionString = process.env.DB_URI;
const PORT = process.env.PORT || 4000

mongoose.connect(connectionString)
.then(()=> console.log("DB Connect Successfully"))
.catch(err => console.error("DB connection error", err.message));



//db connection
// connectDB()


//api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


app.get('/', (req, res) => {
    res.send('Hello, this is the API for managing a simple Food delivery.');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
