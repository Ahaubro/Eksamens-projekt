import { response, Router } from "express";
import db from "../Database/CreateConnection.js";
import bcrypt from "bcrypt";
import stream from "stream";

const saltRounds = parseInt(process.env.SALTROUNDS);

const router = Router();

//Get one user by id
router.get("/getUsername/:id", async (req, res) => {
    const  id = req.params.id
    const sqlSelect = "SELECT username FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function (err, result) {
        if (err) throw err;

        res.send(result[0].username);
    });
});

//Get one user by id LEGER LIDT HER
router.get("/getUserById/:id", async (req, res) => {
    const  id = req.params.id
    const sqlSelect = "SELECT * FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function (err, result) {
        if (err) throw err;

        res.send(result[0]);
    });
});

router.get("/getProfile", async (req, res) => {

    const id = req.session.userID
    let sqlSelect = "SELECT * FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function (err, result) {
        if (err)
            res.send(err)

        if (result[0]) {
            let { username: username, firstname: firstname, middlename: middlename,
                lastname: lastname, birthday: birthday, address: address, country: country, city: city,
                zipcode: zipcode, profilecolor: profilecolor, profilePicture: profilePicture } = result[0]
                
            res.send(JSON.stringify({ username, firstname, middlename, lastname, birthday, address, country, city, zipcode, profilecolor, profilePicture}))
        } else {
            res.send("didnt find anything")
        }
    })
});

router.patch("/editProfile", async (req, res) => {

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

export default router;