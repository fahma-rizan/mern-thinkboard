import express from "express";
import { getAllNotes } from "../controllers/notesController.js";
const router = express.Router();

const notesRoutes = express.Router();

notesRoutes.get("/",getAllNotes);

notesRoutes.post("/",createNote);

notesRoutes.put("/:id",updateNote);

notesRoutes.delete("/:id",deleteNote);

export default notesRoutes;