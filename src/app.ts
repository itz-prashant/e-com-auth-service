import express from "express";

const app = express();

app.get("/", (req, res) => {
    return res.send("Welcome to auth servicse");
});

export default app;
