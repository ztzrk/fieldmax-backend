// src/index.ts
import express, { Express, Request, Response } from "express";
import { AuthRoute } from "./auth/auth.route";
import { UsersRoute } from "./users/users.route";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

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
