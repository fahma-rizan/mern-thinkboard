import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//middleware
app.use(
    cors(
        { origin: "http://localhost:5173",
        }
    ));
app.use(express.json());
app.use(rateLimiter); //this middleware will parse JSON bodies: req.body

//our simple custome middleware
app.use((req,res,next) =>{
    console.log(`Req method is ${req.method} and req url is ${req.url}`);
    next();
});

app.use("/api/notes", notesRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT: ${PORT}`);
    });
});
