import express from "express";

const app = express();

app.use(express.static("../Client/Public"));
app.use(express.json());

import SSR from "./SSR/SSR.js";
app.get("/", (req, res) => res.send(SSR.homePage) );
app.get("/chatrooms", (req, res) => res.send(SSR.chatroomsPage) );
app.get("/smileposts", (req, res) => res.send(SSR.smilePostsPage) );
app.get("/login", (req, res) => res.send(SSR.loginPage) );

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("App running on port " + PORT)
});