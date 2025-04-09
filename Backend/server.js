import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routers/users.js";
import { createError } from "./utils/errors.js";
import { connect2DB } from "./utils/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// DB Connection
connect2DB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/users", userRouter);

// Error Handling
app.use((req, res, next) => {
  next(createError("Route Not Found", 404))
})


app.listen(PORT, console.log("Server is running on port", PORT));