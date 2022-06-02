import { Router } from "express";
import db from "../Database/CreateConnection.js";

const router = Router();

router.get("/api/chatrooms", (req, res) => {
    db.query("SELECT * FROM chatrooms LEFT JOIN users ON chatrooms.creatorId = users.id", (err, result) => {
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

router.post("/api/chatrooms", (req, res) => {
    const { name } = req.body;
    const userId = req.session.userID;
    db.query("SELECT COUNT(*) AS count FROM chatrooms WHERE creatorId = ?", [userId], (error, result) => {
        console.log(result);
        if(result[0].count < 3){
            db.query("INSERT INTO chatrooms(creatorId, name) VALUES (?, ?)", [userId, name], (error, result) => {
                res.send(`Created chatroom: ${name}`);
            });
        }else{
            res.statusCode = 400;
            res.send("You can only make 3 chatrooms. You already made 3 or more chatrooms");
        }
    });
});

export default router;