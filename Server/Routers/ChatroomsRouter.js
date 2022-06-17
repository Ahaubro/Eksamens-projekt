import { Router } from "express";
import db from "../Database/CreateConnection.js";

const router = Router();

router.get("/api/chatrooms", (req, res) => {
    db.query("SELECT chatrooms.id AS id, creatorId, name, max_message_length, users.id AS userid, username FROM chatrooms LEFT JOIN users ON chatrooms.creatorId = users.id", (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});


router.get("/api/chatrooms/:id", (req, res) => {
    const id  = Number(req.params.id)
    db.query("SELECT * FROM chatrooms WHERE id = ?", [id], (err, result) => {
        if(err) throw err;
        console.log(result[0]);
        res.send(result[0]);
    });
});


router.post("/api/chatrooms", (req, res) => {
    const { name, maxMsgLength } = req.body;
    console.log(maxMsgLength);
    const userId = req.session.userID;
    db.query("SELECT COUNT(*) AS count FROM chatrooms WHERE creatorId = ?", [userId], (error, result) => {
        if(result[0].count < 3){
            console.log(maxMsgLength);
            db.query("INSERT INTO chatrooms(creatorId, name, max_message_length) VALUES (?, ?, ?)", [userId, name, maxMsgLength], (error, result) => {
                res.send(`Created chatroom: ${name}`);
            });
        }else{
            res.statusCode = 400;
            res.send("You can only create 3 chatrooms. You have already created 3 chatrooms");
        }
    });
});


router.get("/api/chat_messages/:roomId", (req, res) => {
    const {roomId} = req.params;
    db.query("SELECT * FROM chat_messages LEFT JOIN users ON chat_messages.userId = users.id WHERE roomId = ?", [roomId], (error, messages) => {
        console.log(messages)
        res.send(messages);
    });
});


router.post("/api/chat_messages", (req, res) => {
    console.log("Saving message");
    const {message, roomId} = req.body;
    const userId = req.session.userID;
    db.query("INSERT INTO chat_messages(userId, message, roomId) VALUES (?, ?, ?)", [userId, message, roomId], () => {
        db.query("SELECT * FROM users WHERE id = ?", [userId], (error, users) => {
            res.send(users[0].username);
        });
    });
});

export default router;