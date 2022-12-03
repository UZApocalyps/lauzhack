import express from "express";
import {resolve} from "path";
import { v1 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.use(express.json());


app.get("/", (req, res) => {
    console.log("Getting a request on /");
    res.sendFile(resolve("./src/pages/index.html"));
});

app.get("/shopping_list", (req, res) => {
    res.sendFile(resolve("./src/pages/shopping_list.html"));
});

app.post("/create_ticket", (req, res) => {
    console.log(req.body);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
        token: uuidv4()
    }, undefined, 3));
});

app.use(express.static(resolve("./out/")));
app.listen(port, () => {
    console.log("Listening on port : ", port);
});