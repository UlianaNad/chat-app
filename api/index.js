import express from "express";
import "dotenv/config.js";
import mongoose from "mongoose";
import { UserModel } from "./models/User.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import { WebSocketServer } from "ws";
mongoose.connect(process.env.MONGO_URL);

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);
const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/current", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (error, userData) => {
      if (error) throw error;

      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await UserModel.findOne({ username });

  if (foundUser) {
    const passwordOk = bcrypt.compareSync(password, foundUser.password);
    if (passwordOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (error, token) => {
          if (error) throw error;

          res.cookie("token", token).status(200).json({ _id: foundUser._id });
        }
      );
    }
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

    const User = await UserModel.create({
      username: username,
      password: hashedPassword,
    });

    jwt.sign({ userId: User._id, username }, jwtSecret, {}, (error, token) => {
      if (error) throw error;

      res.cookie("token", token).status(201).json({ _id: User._id });
    });
  } catch (error) {
    if (error) throw error;
  }
});

const server = app.listen(4040);

const wss = new WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  console.log("connected");
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token"));

    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify(
        {onLine: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username,
        }))}
      )
    );
  });
});
