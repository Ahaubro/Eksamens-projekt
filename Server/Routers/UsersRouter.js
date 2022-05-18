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

//Get one user by id
router.get("/auth/getUser/:id", async (req, res) => {
    const  id = req.params.id
    const sqlSelect = "SELECT username FROM users WHERE id = ?";
    const foundUser = await db.query(sqlSelect, [id], function(err, result) {
        if(err) throw err;

        res.send(result[0].username);
    });
});


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
            let { username: username, password: password, firstname: firstname, middlename: middlename, lastname: lastname, birthday: birthday, address: address, country: country, city: city, zipcode: zipcode, profilecolor: profilecolor } = result[0]
            // username = result[0].username
            // firstname = result[0].firstname
            // middlename = result[0].middlename
            // lastname = result[0].lastname
            // birthday = result[0].birthday
            // address = result[0].address
            // country = result[0].country
            // city = result[0].city
            // zipcode = result[0].zipcode
            // profilecolor = result[0].profilecolor
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
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                console.log(birthday, typeof(birthday))
                let updateProfile1 = `UPDATE users SET username = IFNULL(?, users.username), password = IFNULL(?, password), firstname = IFNULL(?, firstname), 
                    middlename = IFNULL(?, middlename), lastname = IFNULL(?, lastname), birthday = IFNULL(?, "2022-01-01"), address = IFNULL(?, address), 
                    country = IFNULL(?, country), city = IFNULL(?, city), zipcode = IFNULL(?, zipcode), profilecolor = IFNULL(?, profilecolor) WHERE id = ?`
                const editQuery = await db.query(updateProfile1, [username, hashedPassword, firstname, middlename, lastname, birthday, address, country, city, zipcode, profilecolor, id], function (err, result) {
                    console.log("kommer du herind?")

                    if (err) {
                        console.log(err)
                        return res.send("something went wrong")
                    }
                    console.log("hvad så, kommer du herind?")
                    return res.send("Your profile have now been changed")
                });
            }
            editProfile();
        }

    });

    // const id = req.session.userID;
    
    // const { username, password, firstname, middlename,
    //     lastname, birthday, address, country, city, zipcode, profilecolor } = req.body

    // let sqlSelect = "SELECT * FROM users WHERE id = ?";
    // const foundUser = await db.query(sqlSelect, [id], function (err, result) {
        
    //     const { username: DBusername, password: DBpassword, firstname: DBfirstname, middlename: DBmiddlename, 
    //         lastname: DBlastname, birthday: DBbirthday, address: DBaddress, country: DBcountry, city: DBcity, 
    //         zipcode: DBzipcode, profilecolor: DBprofilecolor } = result[0]
        
    //     if (err) {
    //         return res.status(400).send();
    //     }

    //     if (!id) {
    //         return res.send("Something went wrong - contact an admin");

    //     } else {
    //         async function editProfile(id, user){
    //             const result = await db.query(
    //               `UPDATE users
    //               SET username="${user.username}", password=${user.password}, firstname=${user.firstname}, 
    //               middlename=${user.middlename}, lastname=${user.lastname}, birthday=${user.birthday}, 
    //               address=${user.address}, country=${user.country}, city=${user.city}, zipcode=${user.zipcode},
    //               profilecolor=${user.profilecolor} WHERE id=${id}` 
    //             );
              
    //             let message = 'Error in updating programming language';
              
    //             if (result.affectedRows) {
    //               message = 'Programming language updated successfully';
    //             }
              
    //             return {message};
    //           }
        
    //         console.log("1kommer den ind her?")
    //         MANGLER BCRYPT PÅ PASSWORD CHANGE
    //         async function editProfile() {
                
    //             if( username !== undefined ){
    //                 const hashedPassword = await bcrypt.hash(password, saltRounds);
    //                 const editUsername = await db.query(updateProfile, [username, hashedPassword, firstname, middlename, 
    //                     lastname, birthday, address, country, city, zipcode, profilecolor, id], function (err, result) {
    //                     //bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             }
    //             console.log(username)
    //             if( username !== undefined ){
    //                 const updateUsername = "UPDATE `smiles`.`users` SET username = ? WHERE id = ?"
    //                 console.log("2kommer den ind her?")
    //                 const editUsername = await db.query(updateUsername, [username, id], function (err, result) {
    //                     bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             }
    //             if (password !== undefined) {
    //                 const updatePassword = "UPDATE `smiles`.`users` SET password = ? WHERE id = ?"

    //                 const hashedPassword = await bcrypt.hash(password, saltRounds);
    //                 const editPassword = await db.query(updatePassword, [hashedPassword, id], function (err, result) {
    //                     bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             } 
    //             if (firstname !== undefined) {
    //                 const updateFirstname = "UPDATE `smiles`.`users` SET firstname = ? WHERE id = ?"

    //                 const editFirstname = await db.query(updateFirstname, [firstname, id], function (err, result) {
    //                     bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             } 
    //             if (middlename !== undefined) {
    //                 const updateMiddlename = "UPDATE `smiles`.`users` SET middlename = ? WHERE id = ?"

    //                 const editMiddlename = await db.query(updateMiddlename, [middlename, id], function (err, result) {
    //                     bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             } 
    //             if (lastname !== undefined) {
    //                 const updateLastname = "UPDATE `smiles`.`users` SET lastname = ? WHERE id = ?"

    //                 const editLastname = await db.query(updateLastname, [lastname, id], function (err, result) {
    //                     bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             } 
    //             if (birthday !== undefined) {
    //                 const updateBirthday = "UPDATE `smiles`.`users` SET birthday = ? WHERE id = ?"

    //                 const editBirthDay = await db.query(updateBirthday, [birthday, id], function (err, result) {
    //                     bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             } 
    //             if (address !== undefined) {
    //                 const updateAddress = "UPDATE `smiles`.`users` SET address = ? WHERE id = ?"

    //                 const editAddress = await db.query(updateAddress, [address, id], function (err, result) {
    //                     bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             } 
    //             if (country !== undefined) {
    //                 const updateCountry = "UPDATE `smiles`.`users` SET country = ? WHERE id = ?"

    //                 const editCountry = await db.query(updateCountry, [city, id], function (err, result) {
    //                     bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             } 
    //             if (city !== undefined) {
    //                 const updateCity = "UPDATE `smiles`.`users` SET city = ? WHERE id = ?"
             
    //                 const editZipCode = await db.query(updateCity, [zipcode, id], function (err, result) {
    //                     bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             } 
    //             if (zipcode !== undefined) {
    //                 const updateZipcode = "UPDATE `smiles`.`users` SET zipcode = ? WHERE id = ?"

             
    //                 const editZipCode = await db.query(updateZipcode, [zipcode, id], function (err, result) {
    //                     bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             } 
    //             if (profilecolor !== undefined) {
    //                 const updateProfilecolor = "UPDATE `smiles`.`users` SET profilecolor = ? WHERE id = ?"

    //                 const editProfileColor = await db.query(updateProfilecolor, [profilecolor, id], function (err, result) {
    //                     bcrypt
    //                     if (err) {
    //                         return res.send("something went wrong")
    //                     }

    //                     return res.send("Your profile have now been changed")
    //                 });
    //             }

    //         editProfile();
    //             }
    //             update();
    //         });    
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