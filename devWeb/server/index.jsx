const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const CodeBlock = require('./models/CodeBlock');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'your_mongodb_uri_here'; // Replace with your MongoDB URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

let mentorSocket = null;

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/codeblocks', async (req, res) => {
    try {
        const codeBlocks = await CodeBlock.find({});
        res.json(codeBlocks);
    } catch (err) {
        res.status(500).send(err);
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', async (data) => {
        try {
            const codeBlock = await CodeBlock.findById(data.id);
            if (!codeBlock) return;

            if (!mentorSocket) {
                mentorSocket = socket.id;
                socket.emit('role', 'mentor');
                socket.emit('codeBlock', codeBlock);
            } else {
                socket.emit('role', 'student');
                socket.emit('codeBlock', codeBlock);
                socket.to(mentorSocket).emit('studentConnected');
            }
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('codeChange', (newCode) => {
        socket.to(mentorSocket).emit('codeUpdate', newCode);
    });

    socket.on('disconnect', () => {
        if (socket.id === mentorSocket) {
            mentorSocket = null;
            io.emit('mentorDisconnected');
        }
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
