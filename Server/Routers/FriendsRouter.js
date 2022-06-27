import { Router } from "express"
import db from "../Database/CreateConnection.js"

const router = Router();


//Reads friends belonging to a profile from id
router.get("/api/profileFriends/:userId", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const userId = req.params.userId
    db.query("SELECT * FROM friends WHERE userOne = ? OR userTwo = ?;", [userId, userId], (error, result) => {
        if (error) throw error;
        res.send(result);
    });
});


//Reads myFriends for myPage.html
router.get("/api/Myfriends/", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const userId = req.session.userID
    db.query("SELECT * FROM friends WHERE userOne = ? OR userTwo = ?", [userId, userId], (error, result) => {
        if (error) throw error;
        res.send(result);
    });
});


//Creates new friendship between users
router.post("/api/friends", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const userOneId = req.session.userID
    const { userTwoId } = req.body

    db.query("SELECT * FROM friends WHERE userOne = ? AND userTwo = ? OR userOne = ? AND userTwo = ?", [userOneId, userTwoId, userTwoId, userOneId], (error, result) => {
        if (error) throw error;
        if (result[0]) {
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