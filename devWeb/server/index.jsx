// const path = require('path');
// const CodeBlock = require('./models/CodeBlock');
require('./models/CodeBlock.jsx');
const express = require('express');
const mongoose = require('mongoose');
const CodeBlock = mongoose.model('CodeBlock');
const app = express();

const http = require('http');
const server = http.createServer(app);

const uriMongo = "mongodb+srv://tamirblumberg:UOJdIUi6m6CaaxNg@cluster-moveo.yoerpwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-Moveo"
mongoose.connect(uriMongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));



const socketIo = require('socket.io');
const cors = require('cors');


// Enable CORS for all origins
app.use(cors());

const io = socketIo(server, {
    cors: {
        origin: "http://127.0.0.1:3000", // Allow this origin
        methods: ["GET", "POST"], // Allow these methods
        credentials: true
    }
});



let idInput = null;
let roomMentors = {};

io.on('connection', (socket) => {
    console.log('A client connected: ' + socket.id);
    socket.on('getCodeBlock', async (data) => {
        try {
            console.log('getCodeBlocks ', data.id);
            let codeBlock = await CodeBlock.findById(data.id);
            if (!codeBlock) {
                codeBlock = new CodeBlock({ index: data.id,title:'a' ,code: 'default code' }); // Replace 'default code' with your actual default code
                await codeBlock.save();
            }
            socket.emit('codeBlock', codeBlock);
        }
        catch (err) {
            console.error(err);
        }

    });
    socket.on('join', async (data) => {
        try {
            console.log('data.id: ', data.id);
            idInput = data.id;
            // const codeBlock = 'codeBlock Test \n const i = 5';
            const codeBlock = await CodeBlock.findById(data.id);

            if (!codeBlock) return;

            // Make the client join a room that corresponds to the code block's ID
            socket.join(data.id);

            // Check if the room already has a mentor
            if (!roomMentors[data.id]) {
                roomMentors[data.id] = socket.id;
                socket.emit('role', 'mentor');
                socket.emit('codeBlock', codeBlock);
            } else {
                socket.emit('role', 'student');
                socket.emit('codeBlock', codeBlock);
                socket.to(roomMentors[data.id]).emit('studentConnected');
            }
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('codeChange', (data) => {
        console.log('codeChange: ', data);
        // Broadcast the code change only to the other clients in the same room
        socket.to(data.id).emit('codeUpdate', data.newCode);
    });

    socket.on('disconnect', () => {
        // Check if the disconnecting user is a mentor
        for (let roomId in roomMentors) {
            if (roomMentors[roomId] === socket.id) {
                delete roomMentors[roomId];
                io.to(roomId).emit('mentorDisconnected');
            }
        }
        console.log('A user disconnected');
    });
});






// Serve static files from the 'public' directory
// app.use(express.static('index.html'));


app.get('/api/codeblocks', async (req, res) => {
    try {
        console.log('User joined - server side');
        const codeBlocks = await CodeBlock.find({});
        res.json(codeBlocks);
    } catch (err) {
        res.status(500).send(err);
    }
});
app.post('/api/codeblocks', async (req, res) => {
    const { index, title, code } = req.body;
    const condition = { index };
    const data = { index, title, code };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
        const doc = await CodeBlock.findOneAndUpdate(condition, data, options);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// io.on('connection', (socket) => {
//     console.log('A user connected');
//
//     socket.on('join', async (data) => {
//         try {
//             console.log('data.id: ', data.id);
//             // const codeBlock = await CodeBlock.findById(data.id);
//             // if (!codeBlock) return;
//
//             // if (!mentorSocket) {
//             //     mentorSocket = socket.id;
//             //     socket.emit('role', 'mentor');
//             //     socket.emit('codeBlock', codeBlock);
//             // } else {
//             //     socket.emit('role', 'student');
//             //     socket.emit('codeBlock', codeBlock);
//             //     socket.to(mentorSocket).emit('studentConnected');
//             // }
//         } catch (err) {
//             console.error(err);
//         }
//     });
//
//     socket.on('codeChange', (newCode) => {
//         socket.to(mentorSocket).emit('codeUpdate', newCode);
//     });
//
//     socket.on('disconnect', () => {
//         if (socket.id === mentorSocket) {
//             mentorSocket = null;
//             io.emit('mentorDisconnected');
//         }
//         console.log('A user disconnected');
//     });
// });

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});