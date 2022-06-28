import { Router } from "express";
import db from "../Database/CreateConnection.js";
import bcrypt from "bcrypt";
import fileUpload from "express-fileupload"
import express from "express";

const saltRounds = parseInt(process.env.SALTROUNDS);

const router = Router();
router.use(express.static("../Client/Public/"));
router.use(fileUpload())


//Get username from user id
router.get("/api/users/username/:id", async (req, res) => {
    const  id = req.params.id
    const sqlSelect = "SELECT username FROM users WHERE id = ?";
    db.query(sqlSelect, [id], function (err, result) {
        if (err) throw err;

        res.send(result[0].username);
    });
});


//Get user object from id 
router.get("/api/users/:id", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const id = req.params.id
    const sqlSelect = "SELECT * FROM users WHERE id = ?";
    db.query(sqlSelect, [id], function (err, result) {
        if (err) throw err;

        if (result[0]) {
            let { username, firstname, middlename,lastname, birthday, address, country, city, 
                zipcode, profilecolor, profilepicture, loggedin } = result[0]
                
            res.send(JSON.stringify({ username, firstname, middlename, lastname, birthday, address, country, city, 
                zipcode, profilecolor, profilepicture, loggedin}))
        } else {
            res.send("didnt find anything")
        }
    });
});


//Get logged in user object
router.get("/api/user/loggedin", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const id = req.session.userID;
    const sqlSelect = "SELECT * FROM users WHERE id = ?";
    db.query(sqlSelect, [id], function (err, result) {
        if (err)
            res.send(err)

        if (result[0]) {
            let { username, firstname, middlename, lastname, birthday, address, country, city, zipcode, profilecolor, profilepicture } = result[0]

            res.send(JSON.stringify({ username, firstname, middlename, lastname, birthday, address, country, city, zipcode, profilecolor, profilepicture }))
        } else {
            res.send("didnt find anything3")
        }
    })
});


//Edit profile
router.patch("/api/users", async (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const id = req.session.userID
    let password = req.body.password;
    const sqlSelect = "SELECT * FROM users WHERE id = ?";
    db.query(sqlSelect, [id], function (err, result) {

        if (err) {
            return res.status(400).send();
        }

        if (!id) {
            return res.send("Something went wrong - contact an admin");

        } else {
            async function editProfile() {
                let hashedPassword = ""
                if (password) {
                    hashedPassword = await bcrypt.hash(password, saltRounds);
                    req.body.password = hashedPassword;
                }

                const updateProfile = "UPDATE users SET ? WHERE id = ?"
                db.query(updateProfile, [req.body, id], function (err, result) {

                    if (err) {
                        return res.send("something went wrong")
                    }
                    return res.send("Your profile have now been changed")
                });
            }
            editProfile();
        }

    });
});


export default router;