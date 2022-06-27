import { Router } from "express";
import db from "../Database/CreateConnection.js";

const router = Router();

router.get("/api/search/:query", (req, res) => {
    const query = req.params.query;
    console.log(query);
    if(query){
        db.query("SELECT * FROM users WHERE UPPER(username) LIKE ?", ["%"+query.toUpperCase()+"%"], (error, result) => {
            if (error) return res.send(error);
            res.send(result);
        });
    }else{
        db.query("SELECT * FROM users", (error, result) => {
            if (error) return res.send(error);
            res.send(result);
        });
    }
});

router.get("/api/search", (req, res) => {
    console.log("searched for nothing");
    db.query("SELECT * FROM users", (error, result) => {
        if (error) return res.send(error);
        res.send(result);
    });
});

export default router;