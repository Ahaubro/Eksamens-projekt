import { Router } from "express";
import { readSync } from "fs";
import db from "../Database/CreateConnection.js";
import ssr from "../SSR/SSR.js"

const router = Router();


router.get("/api/posts", (req, res) => {
    db.query("SELECT * FROM posts", (error, result) => {
        res.send(result);
    });
});

//Posts that are liked by user
router.get("/api/likedPosts/", (req, res) => {
    const userId = req.session.userID;
    db.query("SELECT * FROM likedposts WHERE userId = ?", [userId], (error, result) => {
        if (error) throw error;
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
    const { text, categori } = req.body;
    const { userID } = req.session;
    db.query("INSERT INTO posts(text, userid, date, hours, minutes, categori) VALUES (?, ?, ?, ?, ?, ?)", [text, userID, dateNow, hours, minutes, categori], (error, result) => {
        res.send(result);
    });
});

router.put("/api/posts/:id", async (req, res) => {
    const postId = Number(req.params.id);
    const userId = req.session.userID;

    db.query("UPDATE posts SET  ? WHERE id = ?", [req.body, postId], (error, result) => {
        if (error)
            return res.send(error);
        return res.send("Succesfully updated post");
    });


});


router.put("/api/postsOnlyLikes/:id", async (req, res) => {
    const postId = Number(req.params.id);
    const userId = req.session.userID;

    const { reaction } = req.body

    let reactionsArray = ['likes', 'hearts', 'cares']

    const reactionId = reactionsArray.indexOf(reaction);

    db.query("INSERT INTO likedPosts (userId, postId, reaction) VALUES (?, ?, ?)", [userId, postId, reactionId])

    db.query(`SELECT ${reaction} FROM posts WHERE id = ?`, [postId], (error, result) => {
        if (error) throw error;
        let reactionCount = result[0][reaction]

        reactionCount++;

        db.query(`UPDATE posts SET ${reaction} = ? WHERE id = ?`, [reactionCount, postId], (error, result) => {
            if (error)
                return res.send(error);
            return res.send("Succesfully updated post");
        });

    });
});

router.put("/api/postsOnlyUnLikes/:id", async (req, res) => {
    const postId = Number(req.params.id);
    const userId = req.session.userID;

    const { reaction } = req.body

    let reactionsArray = ['likes', 'hearts', 'cares']

    const reactionId = reactionsArray.indexOf[reaction];

    db.query("INSERT INTO likedPosts (userId, postId, reaction) VALUES (?, ?, ?)", [userId, postId, reactionId])

    db.query(`SELECT ${reaction} FROM posts WHERE id = ?`, [postId], (error, result) => {
        if (error) throw error;
        let reactionCount = result[0][reaction]

        reactionCount--;

        db.query(`UPDATE posts SET ${reaction} = ? WHERE id = ?`, [reactionCount, postId], (error, result) => {
            if (error)
                return res.send(error);
            return res.send("Succesfully updated post");
        });

    });
});

router.delete("/api/unlike/:postId", (req, res) => {
    const postId = Number(req.params.postId);
    console.log("BACKEND_ " + postId)

    db.query("DELETE FROM likedposts WHERE postId = ?", [postId], (error, result) => {
        if (error)
            return res.send(error);
        res.send("The post have been deleted");
    });
});

// TIL HER ------------------------------------

router.delete("/api/posts/:id/:userId", (req, res) => {
    const id = Number(req.params.id);
    const userId = Number(req.params.userId);
    if (userId == req.session.userID) {
        db.query("DELETE FROM likedposts WHERE postId = ?", [id], (error) => {
            if (error) throw error;
        })
        db.query("DELETE FROM posts WHERE id = ?", [id], (error, result) => {
            if (error)
                return res.send(error);
            res.send("The post have been deleted");
        });
    } else {
        res.status(400).send("You can only delete your own posts")
    }
});

export default router;