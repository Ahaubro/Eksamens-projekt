import { response, Router } from "express";
import db from "../Database/CreateConnection.js";
import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALTROUNDS);

const router = Router();

//Get one user by id
router.get("/getUsername/:id", async (req, res) => {
    const  id = req.params.id
    const sqlSelect = "SELECT username FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function(err, result) {
        if(err) throw err;

        res.send(result[0].username);
    });
});

router.get("/getProfile", async (req, res) => {

    const id = req.session.userID
    let sqlSelect = "SELECT * FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function (err, result) {
        if (err)
            res.send(err)

        if (result[0]) {
            let { username: username, password: password, firstname: firstname, middlename: middlename, 
                lastname: lastname, birthday: birthday, address: address, country: country, city: city, 
                zipcode: zipcode, profilecolor: profilecolor } = result[0]
            res.send(JSON.stringify({ username, firstname, middlename, lastname, birthday, address, country, city, zipcode, profilecolor }))
        } else {
            res.send("didnt find anything")
        }
    })
});

router.patch("/editProfile", async (req, res) => {

    const id = req.session.userID
    const { username, password, firstname, middlename,
    lastname, birthday, address, country, city, zipcode, profilecolor } = req.body

    let sqlSelect = "SELECT * FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function (err, result) {
        
        if (err) {
            return res.status(400).send();
        }

        if (!id) {
            return res.send("Something went wrong - contact an admin");
        
        } else {
            async function editProfile() {
                let hashedPassword = ""
                let tempPass = password
                if( password ) {
                    hashedPassword = await bcrypt.hash(password, saltRounds);
                    tempPass = hashedPassword;
                }
                let updateProfile1 = `UPDATE users SET username = IFNULL(?, username), password = IFNULL(?, password), firstname = IFNULL(?, firstname), 
                    middlename = IFNULL(?, middlename), lastname = IFNULL(?, lastname), birthday = IFNULL(?, birthday), address = IFNULL(?, address), 
                    country = IFNULL(?, country), city = IFNULL(?, city), zipcode = IFNULL(?, zipcode), profilecolor = IFNULL(?, profilecolor) WHERE id = ?`
                const editQuery = await db.query(updateProfile1, [username, tempPass, firstname, middlename, lastname, birthday, address, country, 
                    city, zipcode, profilecolor, id], function (err, result) {
                    console.log("kommer du herind?")

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