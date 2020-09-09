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

io.on('connection', socket => {
    console.log("- A user connected.");
    io.emit("welcome", { message: "Welcome!" })
    io.on('disconnect', socket => {
        console.log("- A user disconnected.");
    })
})

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Listening on *:${port}.`)
});