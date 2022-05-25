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

router.post("/api/posts", (req, res) => {
    const dateNow = new Date();
    const hours = formatTime(dateNow.getHours())
    const minutes = formatTime(dateNow.getMinutes())
    console.log(hours, minutes)
    const {text} = req.body;
    const { userID } = req.session;
    db.query("INSERT INTO posts(text, userid, date, hours, minutes) VALUES (?, ?, ?, ?, ?)", [text, userID, dateNow, hours, minutes], (error, result) => {
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

// TIL HER ------------------------------------

router.delete("/api/posts/:id", (req, res) => {
    const id = Number(req.params.id);
    db.query("DELETE FROM posts WHERE id = ?", [id], (error, result) => {
        if(error)
            return res.send(error);
        res.send(result);
    });
});


//Function that formats time for posts creation
function formatTime(time) {
    
    if ( time < 10 ) {

        return '0' + time;
    }
    return time;
}

export default router;