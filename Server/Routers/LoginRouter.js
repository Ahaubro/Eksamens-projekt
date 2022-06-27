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
    max: 5,
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
            return res.status(400).send();
        }

        if (result[0]) {
            resUser = result[0].username
            resPas = result[0].password
            resID = result[0].id
        }
        db.query("UPDATE users set loggedin = 1 WHERE username = ?",[resUser], (error, result) =>{
            if(error) throw error;

        })
        if (!resUser) {
            return res.send("Wrong username or password");
        }

        async function isSame() {
            const result = await bcrypt.compare(password, resPas);

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
            return res.send("You are already logged in")
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
        db.query("UPDATE users set loggedin = 0 WHERE username = ?",[username], (error, result) =>{
            if(error) throw error;
        })
        return res.status(201).send("You have been logged out from user: " + username);
    } else {
        return res.status(404).send("You are not logged in");
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

                    sendMail(email);
                    return res.status(201).send("You have signed up new user " + username)

                });
            }

            hash();
        }
    });
});


// Send mail using nodemailer function
function sendMail(email) {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sharethatsmileforever@gmail.com',
            pass: 'cnakhhtvmxzfgous'
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
            console.log(err)
        } else {
            console.log("Mail sent")
        }
    });
}

export default router;