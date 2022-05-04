import { Router } from "express";
import db from "../Database/CreateConnection.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";

const saltRounds = parseInt(process.env.SALTROUNDS);

const router = Router();

//Limit TEST FASEN, DER SKAL NOK PILLES EN DEL MERE MED DET HER
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false
});

router.use("/auth", authLimiter)


// Log-in function
router.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    let resUser = "";
    let resPas = "";
    let sqlSelect = "SELECT * FROM users WHERE username = ?";
    const foundUser = await db.query(sqlSelect, [username], function (err, result) {
        if(err){
            throw err
        }

        if(result[0]) {
            resUser = result[0].username
            resPas = result[0].password
        }
        
        if(!resUser) {
            return res.send("There is no user with that username")
        }
    
        async function isSame() {
            await bcrypt.compare(password, resPas);
        } 

        if(isSame && !req.session.loggedIn) {
            req.session.loggedIn = true;
            req.session.username = username;
            return res.status(201).send("You have succesfully been logged in to user: " + username)
        }
    
        if(req.session.loggedIn) {
            return res.send("You are already loged in")
        }
    
    });
});


//Log-out function
router.get("/auth/logout", (req, res) => {
    if(req.session.loggedIn) {
        req.session.loggedIn = false;
        const username = req.session.username;
        return res.send("You have been logged out from user: " + username)
    } else {
        return res.send("You are not logged in")
    }
});



//Register user function
router.post("/auth/signup", async (req, res) => {
    const { username, email, password } = req.body

    const sqlSelect1 = "SELECT * FROM users WHERE username = ?";
    const foundUsername = await db.query(sqlSelect1, [username], function (err, result) {
        if(err){
            throw err
        }
        console.log(result)
    });

    const sqlSelect2 = "SELECT * FROM users WHERE email = ?";
    const foundUsermail = await db.query(sqlSelect2, [email], function (err, result) {
        if(err){
            throw err
        }
        console.log(result)
    });

    if(foundUsername) {
        res.send("There is already a user with that username");
    }

    if(foundUsermail) {
        res.send("There is already a user with that email");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sqlInsertQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const { changes } = await db.run(sqlInsertQuery, [username, email, hashedPassword], function (err, result) {
        if(err){
            throw err
        }
        console.log(result)
    });

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
        html:'<p> Thanks for signing up at "navn"! <br> Get to sharing the little everyday things that makes you smile at: <a href="http://localhost:9998/"> Smiles™ </a> </p>'
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