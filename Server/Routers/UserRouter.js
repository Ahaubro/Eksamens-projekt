import { Router } from "express";
import db from "../Database/CreateConnection.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";

const saltRounds = 12;

const router = Router();

//Limit TEST FASEN, DER SKAL NOK PILLES EN DEL MERE MED DET HER
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false
});

router.use("/auth", authLimiter)


// Log-in function
router.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;

    const foundUser = await db.get("SELECT * FROM users WHERE username = ?", [username]);

    if(!foundUser) {
        return res.send("There is no user with that username")
    }

    if(!foundUser.password) {
        return res.send("Wrong password")
    }

    const isSame = await bcrypt.compare(password, foundUser.password);

    if(isSame && !req.session.loggedIn) {
        req.session.loggedIn = true;
        req.session.username = username;
        return res.status(201).send("You have succesfully been logged in to user: " + username)
    }

    if(req.session.loggedIn) {
        return res.send("You are already loged in")
    }
});



//Log-out function
router.get("/auth/logout", (req, res) => {
    if(req.session.loggedIn) {
        req.sessin.loggedIn = false;
        const username = req.session.username;
        return res.send("You have been logged out from user: " + username)
    } else {
        return res.send("You are not logged in")
    }
});



//Register user function
router.post("/auth/signup", async (req, res) => {

    const { username, email, password } = req.body

    const foundUsername = await db.get("SELECT * FROM users WHERE username = ?", [username])
    const foundUsermail = await db.get("SELECT * FROM users WHERE email = ?", [email])

    if(foundUsername) {
        res.send("There is already a user with that username");
    }

    if(foundUsermail) {
        res.send("There is already a user with that email");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { changes } = await db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);

    if(changes === 1) {
        sendMail(email);
        return res.send("You have signed up new user " + username)
    }
});



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
        html:'<p> Tak fordi du oprettede en konto hos os! <br> Kom igang med at dele nu: <a href="http://localhost:9998/"> Klik her </a> </p>'
    };
      
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}

export default router;