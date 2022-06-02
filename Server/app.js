import express from "express";
import session from "express-session";
import usersRouter from "./Routers/UsersRouter.js";
import loginRouter from "./Routers/LoginRouter.js"
import rateLimit from "express-rate-limit";
import postsRouter from "./Routers/PostsRouter.js";
import chatroomsRouter from "./Routers/ChatroomsRouter.js";
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
app.get("/chatrooms", (req, res) => res.send(SSR.loggedInDependent(SSR.chatroomsPage, req.session.userID)));
app.get("/smileposts", (req, res) => res.send(SSR.loggedInDependent(SSR.smilePostsPage, req.session.userID)) );
app.get("/smilepostsOne", (req, res) => res.send(SSR.loggedInDependent(SSR.smilePostsPageOne, req.session.userID)) );
app.get("/smilepostsTwo", (req, res) => res.send(SSR.loggedInDependent(SSR.smilePostsPageTwo, req.session.userID)) );
app.get("/login", (req, res) => res.send(SSR.loggedInDependent(SSR.loginPage, req.session.userID)) );
app.get("/editProfile", (req, res) => res.send(SSR.loggedInDependent(SSR.editPage, req.session.userID)) );

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

app.post("/api/chat_messages", (req, res) => {
    console.log("Saving message");
    const {message, roomId} = req.body;
    const userId = req.session.userID;
    console.log(userId);
    db.query("INSERT INTO chat_messages(userId, message, roomId) VALUES (?, ?, ?)", [userId, message, roomId], (error1, result1) => {
        if(error1)
            console.log("Error getting user:", error1)
        else
            console.log("User from userId:", result1);
        console.log("Getting username");
        db.query("SELECT * FROM users WHERE id = ?", [userId], (error2, result2) => {
            if(error2)
                console.log("Error getting user:", error2)
            else
                console.log("User from userId:", result2);
            res.send(result2[0].username);
        });
    });
});

// Sockets
const server = http.createServer(app);
const io = new Server(server);

import db from "./Database/CreateConnection.js";
io.on("connection", socket => {
    socket.on("sent-message", ({username, message, roomId}) => {
        console.log(username);
        socket.emit("recieved-message", {username, message, roomId});
        socket.broadcast.emit("recieved-message", {username, message, roomId}); 
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log("App running on port " + PORT)
});