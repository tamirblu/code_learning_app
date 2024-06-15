import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios';
// const CodeBlock = require('./models/CodeBlock');
// import {CodeBlock} from '/models/CodeBlock';
// const mongoose = require('mongoose');



function Lobby() {
    // const [codeBlocks, setCodeBlocks] = useState([]);
    const codeBlocks = [
        { title: 'Async Case', code: 'async function example() {\n  await someAsyncCall();\n}' },
        { title: 'Closure Example', code: 'function makeCounter() {\n  let count = 0;\n  return function() {\n    return count++;\n  };\n}' },
        { title: 'Promise Example', code: 'function fetchData() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve("Data"), 1000);\n  });\n}' },
        { title: 'Event Listener', code: 'document.addEventListener("click", function() {\n  console.log("Clicked!");\n});' },
    ];


// Map over the codeBlocks array
//     codeBlocks2.map((block, index) => {
//     // Define the condition for finding the document
//     const condition = { index: index };
//
//     // Define the data for the new document
//     const data = {
//         index: index,
//         title: block.title,
//         code: block.code
//     };
//
//     // Define the options: 'upsert' means it will create a new document if no documents match the condition
//     const options = { upsert: true, new: true, setDefaultsOnInsert: true };
//
//     // Use findOneAndUpdate to either update the existing document or create a new one
//     CodeBlock.findOneAndUpdate(condition, data, options)
//         .then(doc => console.log('Document after update:', doc))
//         .catch(err => console.error('Error:', err));
//     });
    // codeBlocks.map((block, index)=> (
    //     const addBlock = new CodeBlock({
    //         index: index,
    //         title: block.title,
    //         code:block.code,
    //     })
    //
    // )

    // useEffect(() => {
    //     axios.get('/server/index.jsx')
    //         .then(response => {
    //             // setCodeBlocks(response.data);
    //             console.log(`User joined - server side ${response.data}`);
    //
    //         })
    //         .catch(error => {
    //             console.error('There was an error fetching the code blocks!', error);
    //         });
    // }, []);

    return (
        <div>
            <h1>Choose code block</h1>
            <ul>
                {codeBlocks.map((block, index) => (
                    <li key={index}>
                        {/*<Link to={`/CodeBlock/:${index}`}>{block.title}</Link>*/}
                        <Link to={`/CodeBlock/:${index}`}>{block.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
// function Lobby() {
//     console.log('Lobby');
//     return (
//         <div>
//             <h1>Lobby</h1>
//         </div>
//     );
// }

export default Lobby;
