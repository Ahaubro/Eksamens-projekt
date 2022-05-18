import { Router } from "express";
import db from "../Database/CreateConnection.js";

const router = Router();

router.get("/api/posts", (req, res) => {
    db.query("SELECT * FROM posts", (error, result) => {
        res.send(result);
    });
});

router.post("/api/posts", (req, res) => {
    const {text} = req.body;
    const { userID } = req.session;
    db.query("INSERT INTO posts(text, userid) VALUES (?, ?)", [text, userID], (error, result) => {
        res.send(result);
    });
});

router.put("/api/posts/:id", (req, res) => {
    const id = Number(req.params.id);
    const {text} = req.body;
    db.query("UPDATE posts SET text = ? WHERE id = ?", [text, id], (error, result) => {
        if(error)
            return res.send(error);
        res.send(result);
    });
});

router.delete("/api/posts/:id", (req, res) => {
    const id = Number(req.params.id);
    db.query("DELETE FROM posts WHERE id = ?", [id], (error, result) => {
        if(error)
            return res.send(error);
        res.send(result);
    });
});

export default router;