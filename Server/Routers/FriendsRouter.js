import {Router} from "express"
import db from "../Database/CreateConnection.js"

const router = Router();

router.get("/api/friends/", (req, res) => {
    const userId = req.session.userID
    db.query("SELECT * FROM friends WHERE userOne = ? OR userTwo = ?", [userId, userId], (error, result) => {
        if (error) throw error;
        res.send(result);
    });
});


router.post("/api/friends", (req, res) => {
    const userOneId = req.session.userID
    console.log(userOneId)
    const { userTwoId } = req.body
    console.log(userTwoId)
    db.query("SELECT * FROM friends WHERE userOne = ? AND userTwo = ?", [userOneId, userTwoId], (error, result) => {
        if (error) throw error;
        if(result[0]) {
            return res.send("You are already friends")
        } else {
            db.query("INSERT INTO friends(userOne, userTwo) VALUES(?, ?)", [userOneId, userTwoId], (error, result) => {
                if (error) throw error;
                return res.send("You are now friends");
            });
        }
    })
});

export default router;