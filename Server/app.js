import express from "express";
import session from "express-session";
import userRouter from "./Routers/UserRouter.js";
import rateLimit from "express-rate-limit";
import postsRouter from "./Routers/PostsRouter.js";

const app = express();

app.use(express.static("../Client/Public/"));
app.use(express.json());

import SSR from "./SSR/SSR.js";
app.get("/", (req, res) => res.send(SSR.homePage) );
app.get("/chatrooms", (req, res) => res.send(SSR.chatroomsPage) );
app.get("/smileposts", (req, res) => res.send(SSR.smilePostsPage) );
app.get("/login", (req, res) => res.send(SSR.loginPage) );
app.get("/editProfile", (req, res) => res.send(SSR.editPage) );

const baseLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false
});

app.use(baseLimiter);

app.use(express.json());

app.use(session({
    secret: 'We love teddys',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.use(userRouter);

app.use(postsRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("App running on port " + PORT)
});