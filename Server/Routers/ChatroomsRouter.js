import { Router } from "express";
import db from "../Database/CreateConnection.js";

const router = Router();

router.get("/api/chatrooms", (req, res) => {
    
    db.query("SELECT * FROM chatrooms", (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

router.get("/api/chatrooms/:id", (req, res) => {
    const id  = Number(req.params.id)
    db.query("SELECT * FROM chatrooms WHERE id = ?", [id], (err, result) => {
        if(err) throw err;
        res.send(result[0]);
    });
});



export default router;