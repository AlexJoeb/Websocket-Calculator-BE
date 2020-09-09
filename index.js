var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Dot ENv
require('dotenv').config()

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Success message."
    })
})

let lastTen = [];

io.on('connection', socket => {
    // Sends the user the current list on connection.
    socket.emit("NewList", lastTen);

    // When the client sends the server a 'NewEquation' message, the equation is added and the new list is sent to all clients.
    socket.on('NewEquation', ({ equation }) => {
        // Remove the front element is there is 10 or more items, before new item is appended.
        if(lastTen.length >= 10) lastTen = lastTen.slice(1);
        lastTen.unshift({
            ...equation,
            time: Date.now()
        }); // Append new item.

        io.sockets.emit("NewList", lastTen);
    })
    socket.on('disconnect', socket => {
        console.log("- A user disconnected.");
    })
})

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Listening on *:${port}.`)
});