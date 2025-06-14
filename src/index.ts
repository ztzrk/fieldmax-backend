// src/index.ts
import express, { Express, Request, Response } from "express";
import { AuthRoute } from "./auth/auth.route";
import { UsersRoute } from "./users/users.route";

import cors from "cors";
import cookieParser from "cookie-parser";
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
    cors({
        origin: "http://localhost:3001", // Adjust this to your frontend URL
        credentials: true, // Allow cookies to be sent
    })
);
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoute = new AuthRoute();
const usersRoute = new UsersRoute();
app.use("/api", authRoute.router);
app.use("/api", usersRoute.router);

// Simple test route
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to FIELDMAX API! 🚀");
});

// Start the server
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
