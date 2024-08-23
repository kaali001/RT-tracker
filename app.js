import express from "express";
import http from "http";
import path from "path";
import { Server } from 'socket.io';



const app = express();


const __dirname = path.resolve();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.set("view engine","ejs");
app.set(express.static(path.join(__dirname,"public")));

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.on("send-location", (data) => {
      console.log('User disconnected');

      io.emit("receive-location",{id: socket.id, ...data});
    });

    socket.on("disconnect",()=>{
        io.emit("user-disconnected", socket.id);
    });
  });

app.get("/",function(req,res){
    res.render("index");
});

server.listen(3000);
