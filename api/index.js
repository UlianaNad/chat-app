import express from "express";
import "dotenv/config.js";
import mongoose from "mongoose";
import { UserModel } from "./models/User.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
mongoose.connect(process.env.MONGO_URL);

const jwtSecret = process.env.JWT_SECRET;

const app = express();


app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());


app.get('/current', (req,res) => {
  const token = req.cookies?.token;
  if(token){
    jwt.verify(token, jwtSecret, {} , (error, userData)=>{
      if(error) throw error;
  
      res.json(userData)
    })
  } else{
    res.status(401).json('no token')
  }
 
})

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const User = await UserModel.create({ username, password });
    jwt.sign({ userId: User._id, username }, jwtSecret, {}, (error, token) => {
      if (error) throw error;

      res.cookie("token", token).status(201).json({ _id: User._id });
    });
  } catch (error) {
    if (error) throw error;
  }
});

app.listen(4040);

