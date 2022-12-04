import express from "express";
import {resolve} from "path";
import { v1 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';

const app = express();
const port = 3000;


const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on("message", () => {
    setTimeout(() => {
        ws.send("ok");
    }, 2500);
  });
});



app.use(express.json());

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