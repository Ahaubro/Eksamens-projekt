import express from "express";
import session from "express-session";
import usersRouter from "./Routers/UsersRouter.js";
import loginRouter from "./Routers/LoginRouter.js"
import rateLimit from "express-rate-limit";
import postsRouter from "./Routers/PostsRouter.js";
import chatroomsRouter from "./Routers/ChatroomsRouter.js";
import friendsRouter from "./Routers/FriendsRouter.js";
import searchRouter from "./Routers/SearchRouter.js";
import {Server} from "socket.io";
import http from "http";
import bodyParser from "body-parser";

const app = express();

app.use(express.static("../Client/Public/"));

// Bruges til image upload
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//Hertil -----------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'We love teddys',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

import SSR from "./SSR/SSR.js";
app.get("/", (req, res) => res.send(SSR.loggedInDependent(SSR.homePage, req.session.userID)));
app.get("/chatrooms", (req, res) => {
    if(!req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.chatroomsPage, req.session.userID));
});
app.get("/smileposts", (req, res) => {
    if(!req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.smilePostsPage, req.session.userID))
});
app.get("/smilepostsOne", (req, res) => {
    if(!req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.smilePostsPageOne, req.session.userID))
});
app.get("/smilepostsTwo", (req, res) => {
    if(!req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.smilePostsPageTwo, req.session.userID))
});
app.get("/editProfile", (req, res) => {
    if(!req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.editPage, req.session.userID))
});
app.get("/login", (req, res) => res.send(SSR.loggedInDependent(SSR.loginPage, req.session.userID)) );
app.get("/search/:query", (req, res) => {
    if(!req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.getSearchPage(req.params.query), req.session.userID));
});

app.get("/profile/:id", async (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM users WHERE id = ?", [id], (error, result) => {
        if (error)
            res.send(error);
        else if (result[0]) {
            //let { username, firstname, middlename, lastname, birthday, address, country, city,
            //zipcode, profilecolor, profilepicture } = result[0];
            const user = result[0];
            res.send(SSR.loggedInDependent(SSR.loadProfilePage(user), req.session.userID));
        } else {
            res.status = 400;
            res.send("didnt find anything")
        }
    })
});

/* --------------------------------------  AREX -------------------------------------*/
app.get("/profileSearch/:username/:id", async (req, res) => {
    const username = req.params.username;
    const id = req.params.id
    console.log(username)
    db.query("SELECT * FROM users WHERE username = ?", [username], (error, result) => {
        if (error)
            res.send(error);
        else if (result[0]) {
            console.log("Herinde")
            //let { username, firstname, middlename, lastname, birthday, address, country, city,
            //zipcode, profilecolor, profilepicture } = result[0];
            const user = result[0];
            //return res.send(SSR.loggedInDependent(SSR.loadProfilePage(user), req.session.userID));
            return res.redirect(`/profile/${result[0].id}`)
        } else {
            return res.status(400).send("didnt find anything")
        }
    })
});

//Skal nok ikke bruges
/*const baseLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false
});

app.use(baseLimiter); */

app.use(express.json());

app.use(usersRouter);

app.use(loginRouter);

app.use(postsRouter);

app.use(chatroomsRouter);

app.use(friendsRouter);

app.use(searchRouter);

app.get("/api/chat_messages/:roomId", (req, res) => {
    const {roomId} = req.params;
    db.query("SELECT * FROM chat_messages LEFT JOIN users ON chat_messages.userId = users.id WHERE roomId = ?", [roomId], (error, messages) => {
        console.log(messages)
        res.send(messages);
    });
});

app.post("/api/chat_messages", (req, res) => {
    console.log("Saving message");
    const {message, roomId} = req.body;
    const userId = req.session.userID;
    db.query("INSERT INTO chat_messages(userId, message, roomId) VALUES (?, ?, ?)", [userId, message, roomId], () => {
        db.query("SELECT * FROM users WHERE id = ?", [userId], (error, users) => {
            res.send(users[0].username);
        });
    });
});

// Sockets
const server = http.createServer(app);
const io = new Server(server);

import db from "./Database/CreateConnection.js";
io.on("connection", socket => {
    socket.on("sent-message", ({username, message, roomId}) => {
        socket.emit("recieved-message", {username, message, roomId});
        socket.broadcast.emit("recieved-message", {username, message, roomId}); 
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log("App running on port " + PORT)
});