import { Router } from "express"
import db from "../Database/CreateConnection.js";


const router = Router();


//Posts that are liked by user (likedPost)
router.get("/api/likedposts/", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const userId = req.session.userID;
    db.query("SELECT * FROM likedposts WHERE userId = ?", [userId], (error, result) => {
        if (error) throw error;
        res.send(result);
    });
});


//Add reaction to the likedPosts
router.put("/api/likedposts/addReaction/:id", async (req, res) => {
    if (!req.session.userID) return res.redirect("/");
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


// Does the opposite then the method above
router.put("/api/likedposts/removeReaction/:id", async (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const postId = Number(req.params.id);
    const userId = req.session.userID;

    const { reaction } = req.body

    let reactionsArray = ['likes', 'hearts', 'cares']

    const reactionId = reactionsArray.indexOf(reaction);

    db.query("INSERT INTO likedPosts (userId, postId, reaction) VALUES (?, ?, ?)", [userId, postId, reactionId])

    db.query(`SELECT ${reaction} FROM posts WHERE id = ?`, [postId], (error, result) => {
        if (error) throw error;
        let reactionCount = result[0][reaction]

        reactionCount--;
        if (reactionCount < 0) {
            reactionCount = 0;
        }

        db.query(`UPDATE posts SET ${reaction} = ? WHERE id = ?`, [reactionCount, postId], (error, result) => {
            if (error)
                return res.send(error);
            return res.send("Succesfully updated post");
        });

    });
});


//When unbliking post, we have to delete the row which indicates your reaction to a post
router.delete("/api/likedposts/:id", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const postId = Number(req.params.id);

    db.query("DELETE FROM likedposts WHERE postId = ?", [postId], (error, result) => {
        if (error)
            return res.send(error);
        res.send("The post have been deleted");
    });
});

export default router;