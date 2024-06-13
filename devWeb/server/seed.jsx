const mongoose = require('mongoose');
const CodeBlock = require('./models/CodeBlock');

const MONGODB_URI = 'your_mongodb_uri_here'; // Replace with your MongoDB URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('MongoDB connected');

        const codeBlocks = [
            { title: 'Async Case', code: 'async function example() {\n  await someAsyncCall();\n}' },
            { title: 'Closure Example', code: 'function makeCounter() {\n  let count = 0;\n  return function() {\n    return count++;\n  };\n}' },
            { title: 'Promise Example', code: 'function fetchData() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve("Data"), 1000);\n  });\n}' },
            { title: 'Event Listener', code: 'document.addEventListener("click", function() {\n  console.log("Clicked!");\n});' },
        ];

        await CodeBlock.insertMany(codeBlocks);
        console.log('Code blocks inserted');
        mongoose.disconnect();
    })
    .catch(err => console.log(err));
