import { response, Router } from "express";
import db from "../Database/CreateConnection.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";

const saltRounds = parseInt(process.env.SALTROUNDS);

const router = Router();

//Limiter
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false
});

router.use("/auth", authLimiter);

// Log-in function
router.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    let resUser = "";
    let resPas = "";
    let resID = "";
    let sqlSelect = "SELECT * FROM users WHERE username = ?";
    const foundUser = await db.query(sqlSelect, [username], function (err, result) {
        if (err) {
            console.log(err)
            return res.status(400).send();
        }

        if (result[0]) {
            resUser = result[0].username
            resPas = result[0].password
            resID = result[0].id
        }

        if (!resUser) {
            return res.send("Wrong username or password");
        }

        async function isSame() {
            const result = await bcrypt.compare(password, resPas);
            console.log(password + " " + resPas)

            if (result && !req.session.loggedIn) {
                req.session.loggedIn = true;
                req.session.username = username;
                req.session.userID = resID
                return res.status(201).send("You have succesfully been logged in to user: " + username)
            } else {
                return res.send("Wrong username or password");
            }
        }

        isSame();

        if (req.session.loggedIn) {
            return res.send("You are already loged in")
        }

    });
});


//Log-out function
router.get("/auth/logout", (req, res) => {
    if (req.session.loggedIn) {
        req.session.loggedIn = false;
        const username = req.session.username;
        req.session.username = "";
        req.session.userID = 0;
        return res.send("You have been logged out from user: " + username)
    } else {
        return res.send("You are not logged in")
    }
});



//Register user function
router.post("/auth/signup", async (req, res) => {
    const { username, email, password } = req.body

    let resMail = "";
    let resUsername = "";
    let foundUsername = "";
    let foundUsermail = "";

    // Username check
    const sqlSelect1 = "SELECT * FROM users WHERE username = ? OR email = ?";
    foundUsername = await db.query(sqlSelect1, [username, email], function (err, result) {
        if (err) throw err;

        if (result[0]) {
            resUsername = result[0].username
            resMail = result[0].email 
            
            return res.status(404).send("There is already a user with the username or email ")
        } else {
            
            async function hash() {
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const sqlInsertQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
                const res1 = await db.query(sqlInsertQuery, [username, email, hashedPassword], function (err, result) {
                    if (err) throw err;

                    console.log(result)

                    sendMail(email);
                    return res.status(201).send("You have signed up new user " + username)

                });
            }

            hash();

        }
    });
});

router.get("/auth/getProfile", async (req, res) => {

    const id = req.session.userID

    let { username, password, firstname, middlename, lastname, birthday, address, country, city, zipcode, profilecolor } = ""
    let sqlSelect = "SELECT * FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function (err, result) {
        if (err)
            res.send(err)

        if (result[0]) {
            username = result[0].username
            firstname = result[0].firstname
            middlename = result[0].middlename
            lastname = result[0].lastname
            birthday = result[0].birthday
            address = result[0].address
            country = result[0].country
            city = result[0].city
            zipcode = result[0].zipcode
            profilecolor = result[0].profilecolor
            res.send(JSON.stringify({ username, firstname, middlename, lastname, birthday, address, country, city, zipcode, profilecolor }))
        } else {
            res.send("didnt find anything")
        }
    })
});

router.patch("/auth/editProfile", async (req, res) => {

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
            //MANGLER BCRYPT PÅ PASSWORD CHANGE
            async function editProfile() {
                let updateProfile1 = "UPDATE `smiles`.`users` SET username = ?, password = ?, firstname = ?, middlename = ?, lastname = ?, birthday = ?, address = ?, country = ?, city = ?, zipcode = ?, profilecolor = ? WHERE id = ?"
                const editQuery = await db.query(updateProfile1, [username, password, firstname, middlename, lastname, birthday, address, country, city, zipcode, profilecolor, id], function (err, result) {

                    if (err) {
                        return res.send("something went wrong")
                    }
                    
                    return res.send("Your profile have now been changed")
                });
            }
            editProfile();
        }

    });
})

// Send mail using nodemailer function
function sendMail(email) {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sharethatsmileforever@gmail.com',
            pass: 'thorogalexprojekt'
        }
    });

    let mailDetails = {
        from: 'sharethatsmileforever@gmail.com',
        to: email,
        subject: 'Smiles INC',
        html: '<p> Thanks for signing up at "navn"! <br> Get to sharing the little everyday things that makes you smile at: <a href="http://localhost:9998/"> Smiles™ </a> </p>'
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}

export default router;