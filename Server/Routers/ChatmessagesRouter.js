import { Router } from "express"
import db from "../Database/CreateConnection.js"

const router = Router();


//Get method that reads chat messages into the correct rooms along with user info
router.get("/api/chat_messages/:roomId", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const {roomId} = req.params;
    db.query("SELECT * FROM chat_messages LEFT JOIN users ON chat_messages.userId = users.id WHERE roomId = ?", [roomId], (error, messages) => {
        res.send(messages);
    });
});


//Post method that saves chatmessages in db
router.post("/api/chat_messages", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const {message, roomId} = req.body; 
    const userId = req.session.userID;
    db.query("INSERT INTO chat_messages(userId, message, roomId) VALUES (?, ?, ?)", [userId, message, roomId], () => {
        db.query("SELECT * FROM users WHERE id = ?", [userId], (error, users) => {
            res.send(users[0].username);
        });
    });
});

export default router;
