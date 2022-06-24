import { response, Router } from "express";
import db from "../Database/CreateConnection.js";
import bcrypt from "bcrypt";
import fileUpload from "express-fileupload"
import express from "express";
import SSR from "../SSR/SSR.js";

const saltRounds = parseInt(process.env.SALTROUNDS);

const router = Router();

router.use(express.static("../Client/Public/"));
router.use(fileUpload())

//Get username from user id
router.get("/api/getUsername/:id", async (req, res) => {
    const  id = req.params.id
    const sqlSelect = "SELECT username FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function (err, result) {
        if (err) throw err;

        res.send(result[0].username);
    });
});

//Get user object from username
router.get("/api/getUserByUsername/:username", async (req, res) => {
    const username = req.params.username;
    const sqlSelect = "SELECT * FROM users WHERE username = ?";
    const foundUser = await db.query(sqlSelect, [username], function (err, result) {
        if (err) throw err;
        res.send(result[0]);
    });
});

//Get user object from id 
router.get("/api/getUserById/:id", (req, res) => {
    const id = req.params.id
    const sqlSelect = "SELECT * FROM users WHERE id = ?";
    db.query(sqlSelect, [id], function (err, result) {
        if (err) throw err;

        if (result[0]) {
            let { username: username, firstname: firstname, middlename: middlename,
                lastname: lastname, birthday: birthday, address: address, country: country, city: city,
                zipcode: zipcode, profilecolor: profilecolor, profilepicture: profilepicture } = result[0]
                
            res.send(JSON.stringify({ username, firstname, middlename, lastname, birthday, address, country, city, zipcode, profilecolor, profilepicture}))
        } else {
            res.send("didnt find anything")
        }
    });
});

//Get logged in user object
router.get("/api/loggedInUser", (req, res) => {
    const id = req.session.userID;
    const sqlSelect = "SELECT * FROM users WHERE id = ?";
    db.query(sqlSelect, [id], function (err, result) {
        if (err)
            res.send(err)

        if (result[0]) {
            let { username: username, firstname: firstname, middlename: middlename,
                lastname: lastname, birthday: birthday, address: address, country: country, city: city,
                zipcode: zipcode, profilecolor: profilecolor, profilepicture: profilepicture } = result[0]
                
            res.send(JSON.stringify({ username, firstname, middlename, lastname, birthday, address, country, city, zipcode, profilecolor, profilepicture}))
        } else {
            res.send("didnt find anything")
        }
    })
});

//Edit profile
router.patch("/api/editProfile", async (req, res) => {
    const id = req.session.userID
    let password = req.body.password;
    const sqlSelect = "SELECT * FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function (err, result) {

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
                const editQuery = await db.query(updateProfile, [req.body, id], function (err, result) {

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

//Upload profile picture
router.post("/api/uploadPicture", (req, res) => {

    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).send("No files were uploaded")
    }

    const sampleFile = req.files.sampleFile
    
    const uploadPath = '../Client/Public/Images/Uploads/' + sampleFile.name
    sampleFile.mv(uploadPath, function(err) {
        if(err) return res.status(500).send(err)

        res.send('file uploaded!')


    })
})

//Get that sends user object by id for profile.html using SSR
router.get("/profile/:id", async (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM users WHERE id = ?", [id], (error, result) => {
        if (error)
            res.send(error);
        else if (result[0]) {
            const user = result[0];
            res.send(SSR.loggedInDependent(SSR.loadProfilePage(user), req.session.userID));
        } else {
            res.status = 400;
            res.send("didnt find anything")
        }
    })
});

//Get that sends object 
/*router.get("/api/profileSearch/:username/:id", async (req, res) => {
    const username = req.params.username;
    const id = req.params.id
    db.query("SELECT * FROM users WHERE username = ?", [username], (error, result) => {
        if (error)
            res.send(error);
        else if (result[0]) {
            const user = result[0];
            return res.redirect(`/profile/${result[0].id}`)
        } else {
            return res.status(400).send("didnt find anything")
        }
    })
});*/

export default router;