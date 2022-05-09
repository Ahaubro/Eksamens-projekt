import { Router } from "express";
import db from "../Database/CreateConnection.js";

const router = Router();

router.get("/api/posts", (req, res) => {
    db.query("SELECT * FROM posts", (error, result) => {
        res.send(result);
    });
});

router.post("/api/posts", (req, res) => {
    let {text} = req.body;
    db.query("INSERT INTO posts(text) VALUES (?)", [text], (error, result) => {
        res.send(result);
    });
});

export default router;