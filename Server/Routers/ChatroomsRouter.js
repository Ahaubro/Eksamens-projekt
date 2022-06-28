import { Router } from "express";
import db from "../Database/CreateConnection.js";


const router = Router();


//Get specific information about chatrooms, along with user information used for chatrooms
router.get("/api/chatrooms", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    db.query("SELECT chatrooms.id AS id, creatorId, name, max_message_length, users.id AS userid, username FROM chatrooms LEFT JOIN users ON chatrooms.creatorId = users.id", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


//Get chatrooms by id
router.get("/api/chatrooms/:id", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const id  = Number(req.params.id)
    db.query("SELECT * FROM chatrooms WHERE id = ?", [id], (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});


//Chatroom post method create new chatrooms(max 3 pr user)
router.post("/api/chatrooms", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const { name, maxMsgLength } = req.body;
    const userId = req.session.userID;
    db.query("SELECT COUNT(*) AS count FROM chatrooms WHERE creatorId = ?", [userId], (error, result) => {
        if (result[0].count < 3) {
            db.query("INSERT INTO chatrooms(creatorId, name, max_message_length) VALUES (?, ?, ?)", [userId, name, maxMsgLength], (error, result) => {
                res.send(`Created chatroom: ${name}`);
            });
        } else {
            res.statusCode = 400;
            res.send("You can only create 3 chatrooms. You have already created 3 chatrooms");
        }
    });
});


export default router;