import { response, Router } from "express";
import db from "../Database/CreateConnection.js";
import bcrypt from "bcrypt";
import stream from "stream";
import fileUpload from "express-fileupload"
import path from "path"
import express from "express";

const saltRounds = parseInt(process.env.SALTROUNDS);

const router = Router();

//Get one user by id
router.get("/api/getUsername/:id", async (req, res) => {
    const  id = req.params.id
    const sqlSelect = "SELECT username FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function (err, result) {
        if (err) throw err;

        res.send(result[0].username);
    });
});

//Get one user by id LEGER LIDT HER
router.get("/api/getUserById/:id", async (req, res) => {
    const  id = req.params.id
    const sqlSelect = "SELECT * FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function (err, result) {
        if (err) throw err;

        res.send(result[0]);
    });
});

router.get("/api/getProfile", async (req, res) => {

    const id = req.session.userID
    let sqlSelect = "SELECT * FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function (err, result) {
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
                        console.log(err)
                        return res.send("something went wrong")
                    }
                    return res.send("Your profile have now been changed")
                });
            }
            editProfile();
        }

    });
});

router.use(express.static("../Client/Public/"));
router.use(fileUpload())

router.post("/api/uploadPicture", (req, res) => {

    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).send("No files were uploaded")
    }

    const sampleFile = req.files.sampleFile
    console.log(sampleFile)
    
    const uploadPath = '../Client/Public/Images/Uploads/' + sampleFile.name
    sampleFile.mv(uploadPath, function(err) {
        if(err) return res.status(500).send(err)

        res.send('file uploaded!')


    })
})

export default router;