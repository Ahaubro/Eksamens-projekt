import express from "express";
import session from "express-session";
import userRouter from "./Routers/UserRouter.js";
import rateLimit from "express-rate-limit";

const app = express();

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





const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("App running on port " + PORT)
})