import { Router } from "express";
import db from "../Database/CreateConnection.js";
import ssr from "../SSR/SSR.js"

const router = Router();

// Alex leger lidt her--------------------------
/*function ensureAuthenticated(req, res, next) {
    if (req.session.loggedIn)
      return next();
    else 
        console.log("Tryed to redirecvt here")
      return res.send(ssr.homePage)
  }*/

router.get("/api/posts", (req, res) => {
    db.query("SELECT * FROM posts", (error, result) => {
        res.send(result);
    });
});

//Endpoint der kun læser posts tilhørende den user der er logget ind
router.get("/api/postsOfInterest", (req, res) => {
    const userId = req.session.userID
    db.query("SELECT * FROM posts WHERE userId = ?", [userId], (error, result) => {
        res.send(result);
    });
});

router.get("/api/getPostByID/:id", (req, res) => {
    const id = Number(req.params.id)
    db.query("SELECT * FROM posts WHERE id = ?", [id], (error, result) => {
        res.send(result[0]);
    });
});

router.post("/api/posts/", (req, res) => {
    const dateNow = new Date();
    const hours = dateNow.getHours()
    const minutes = dateNow.getMinutes()
    //console.log(hours, minutes)
    const { text, categori } = req.body;
    const { userID } = req.session;
    db.query("INSERT INTO posts(text, userid, date, hours, minutes, categori) VALUES (?, ?, ?, ?, ?, ?)", [text, userID, dateNow, hours, minutes, categori], (error, result) => {
        res.send(result);
    });
});

router.put("/api/posts/:id", (req, res) => {
    const id = Number(req.params.id);
    const {text, userId} = req.body;

    console.log("Userid: " +  userId + "sessionId: " + req.session.userID);
    if(userId == req.session.userID) {
        db.query("UPDATE posts SET text = ? WHERE id = ?", [text, id], (error, result) => {
            if(error)
                return res.send(error);
            res.send("Succesfully updated post");
        });
    } else {
        res.status(400).send("You can only edit your own posts")
    }
});

// TIL HER ------------------------------------

router.delete("/api/posts/:id/:userId", (req, res) => {
    const id = Number(req.params.id);
    const userId = Number(req.params.userId);
    if(userId == req.session.userID) {
        db.query("DELETE FROM posts WHERE id = ?", [id], (error, result) => {
            if(error)
                return res.send(error);
            res.send("The post have been deleted");
        });
    } else {
        res.status(400).send("You can only delete your own posts")
    }
});

export default router;