import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();
console.log("NODE_ENV is:", process.env.NODE_ENV);

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

//middleware
if (process.env.NODE_ENV !== "production") {
    app.use(
        cors({
            origin: "http://localhost:5173",
        })
    );
}

app.use(express.json()); //this middleware will parse JSON bodies: req.body
app.use(rateLimiter);

//our simple custom middleware
app.use((req, res, next) => {
    console.log(`Req method is ${req.method} and req url is ${req.url}`);
    next();
});

// API routes must always be mounted, in every environment
app.use("/api/notes", notesRoutes);

// Serve the built frontend only in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT: ${PORT}`);
    });
});