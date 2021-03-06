import { Router } from "express";
import db from "../Database/CreateConnection.js";

const router = Router();


//Search query (% a % -> sends all users containing a or A)
router.get("/api/search/:query", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const query = req.params.query;
    if(query){
        db.query("SELECT * FROM users WHERE UPPER(username) LIKE ?", ["%"+query.toUpperCase()+"%"], (error, result) => {
            if (error) return res.send(error);
            res.send(result);
        });
    }else{
        db.query("SELECT id, username FROM users", (error, result) => {
            if (error) return res.send(error);
            res.send(result);
        });
    }
});

router.get("/api/search", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    db.query("SELECT id, username FROM users", (error, result) => {
        if (error) return res.send(error);
        res.send(result);
    });
});


export default router;