// Import the required modules
require('./models/CodeBlock.jsx');
const express = require('express');
const mongoose = require('mongoose');
const CodeBlock = mongoose.model('CodeBlock');
const app = express();
const http = require('http');
const server = http.createServer(app);
const uriMongo = "mongodb+srv://tamirblumberg:UOJdIUi6m6CaaxNg@cluster-moveo.yoerpwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-Moveo"

// Define the id and the mentor for each room
let idInput = null;
let roomMentors = {};

// Define the default code blocks
const defaultCodeBlocks = [
    { title: 'Async Case', code: '// Write an async function named fetchData that returns the string \'Hello, World!\'.\n' +
            'async function fetchData() {\n' +
            '  return (change)'+ ' //' +' add Hello, World!\;\n' +
            '}'},
    { title: 'Closure Example', code: 'function makeCounter() {\n  let count = 0;\n  return function() {\n    return () // add count++;\n  };\n}'  },
    { title: 'Promise Example', code: 'function fetchData() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve("Data"), (100)); // Make the time out value equal to one second (1000)\n  });\n}' },
    { title: 'Event Listener', code: 'document.addEventListener("click", function() {\n  console.log("");\n});// add Clicked!' },
];
// Solutions for the default code blocks
const solutions = ['// Write an async function named fetchData that returns the string \'Hello, World!\'.\n' +
    'async function fetchData() {\n' +
    '  return (Hello, World!)'+ ' //' +' add Hello, World!\;\n' +
    '}'
    ,
    'function makeCounter() {\n  let count = 0;\n  return function() {\n    return (count++) // add count++;\n  };\n}'
    ,
    'function fetchData() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve("Data"), (1000)); // Make the time out value equal to one second (1000)\n  });\n}'
    ,
    'document.addEventListener("click", function() {\n  console.log("Clicked!");\n});// add Clicked!']

// Connect to MongoDB
mongoose.connect(uriMongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Import and configure socket.io and CORS
const socketIo = require('socket.io');
const cors = require('cors');

// Enable CORS for all origins
app.use(cors());
const io = socketIo(server, {
    cors: {
        origin: "http://127.0.0.1:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('A client connected: ' + socket.id);
    socket.on('join', async (data) => {
        try {
            idInput = data.id;
            // const codeBlock = 'codeBlock Test \n const i = 5';
            let codeBlock = await CodeBlock.findOne({ index: data.id });
            // If the code block doesn't exist, create a new one
            if (!codeBlock)
                codeBlock = new CodeBlock({ index: data.id, title: defaultCodeBlocks[data.id].title, code:defaultCodeBlocks[data.id].code });
            // If the solution is already in the database, reset the code block to the default code
            if (solutions[idInput] === codeBlock.code)
                codeBlock.code = defaultCodeBlocks[data.id].code;
                codeBlock.title = defaultCodeBlocks[data.id].title;
            if (!codeBlock.code)
                codeBlock = new CodeBlock({ index: data.id, title: defaultCodeBlocks[data.id].title, code:defaultCodeBlocks[data.id].code });
            await codeBlock.save();
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
    // Handle code changes
    socket.on('codeChange',async (data) => {
        socket.to(data.id).emit('codeUpdate', data.newCode);
        let codeBlock = await CodeBlock.findOne({ index: data.id });
        codeBlock.code = data.newCode;
        await codeBlock.save();
    });
    // Handle disconnections
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
server.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000');
});
