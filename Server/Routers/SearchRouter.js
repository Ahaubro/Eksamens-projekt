import { Router } from "express";
import db from "../Database/CreateConnection.js";

const router = Router();

router.get("/api/search/:query", (req, res) => {
    db.query("SELECT * FROM users WHERE UPPER(username) LIKE ?", ["%"+req.params.query.toUpperCase()+"%"], (error, result) => {
        if (error) return res.send(error);
        res.send(result);
    })
});

export default router;