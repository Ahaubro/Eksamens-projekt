import express from "express";
import session from "express-session";
import usersRouter from "./Routers/UsersRouter.js";
import loginRouter from "./Routers/LoginRouter.js"
import postsRouter from "./Routers/PostsRouter.js";
import chatroomsRouter from "./Routers/ChatroomsRouter.js";
import friendsRouter from "./Routers/FriendsRouter.js";
import searchRouter from "./Routers/SearchRouter.js";
import likedpostsRouter from "./Routers/LikedpostsRouter.js"
import chatmessagesRouter from "./Routers/ChatmessagesRouter.js"
import { Server } from "socket.io";
import http from "http";
import SSR from "./SSR/SSR.js";
import db from "./Database/CreateConnection.js";

const app = express();

app.use(express.static("../Client/Public/"));
app.use(express.json());

app.use(session({
    secret: 'We love teddys',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.get("/", (req, res) => res.send(SSR.loggedInDependent(SSR.homePage, req.session.userID)));


app.get("/chatrooms", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.chatroomsPage, req.session.userID));
});


app.get("/smileposts", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.smilePostsPage, req.session.userID))
});


app.get("/mypage", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.myPage, req.session.userID))
});


app.get("/login", (req, res) => {
    if (req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.loginPage, req.session.userID))
});


app.get("/search/:query", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.getSearchPage(req.params.query), req.session.userID));
});

app.get("/search", (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    res.send(SSR.loggedInDependent(SSR.getSearchPage(req.params.query), req.session.userID));
});

app.get("/profile/:id", async (req, res) => {
    if (!req.session.userID) return res.redirect("/");
    const id = req.params.id;
    db.query("SELECT * FROM users WHERE id = ?", [id], (error, result) => {
        if (error)
            res.send(error);
        else if (result[0]) {
            const user = result[0];
            res.send(SSR.loggedInDependent(SSR.loadUserProfilePage(user), req.session.userID));
        } else {
            res.status = 400;
            res.send("didnt find anything1")
        }
    })
});

app.use(usersRouter);

app.use(loginRouter);

app.use(postsRouter);

app.use(chatroomsRouter);

app.use(friendsRouter);

app.use(searchRouter);

app.use(likedpostsRouter)

app.use(chatmessagesRouter)


// Sockets
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", socket => {
    socket.on("sent-message", ({ username, message, roomId }) => {
        socket.emit("recieved-message", { username, message, roomId });
        socket.broadcast.emit("recieved-message", { username, message, roomId });
    });

    socket.on("reactions", ({ id, likeCount, heartCount, careCount }) => {
        db.query("SELECT likes, hearts, cares FROM posts where id = ?", [id], (error, result) => {
            if (error) throw error;
            likeCount = result[0].likes
            heartCount = result[0].hearts
            careCount = result[0].cares
            socket.emit("reaction-change", { id, likeCount, heartCount, careCount });
            socket.broadcast.emit("reaction-change", { id, likeCount, heartCount, careCount });
        });
    })
})

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log("App running on port " + PORT)
});