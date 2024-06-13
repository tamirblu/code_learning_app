import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Lobby() {
    // const [codeBlocks, setCodeBlocks] = useState([]);
    const codeBlocks = [
        { title: 'Async Case', code: 'async function example() {\n  await someAsyncCall();\n}' },
        { title: 'Closure Example', code: 'function makeCounter() {\n  let count = 0;\n  return function() {\n    return count++;\n  };\n}' },
        { title: 'Promise Example', code: 'function fetchData() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve("Data"), 1000);\n  });\n}' },
        { title: 'Event Listener', code: 'document.addEventListener("click", function() {\n  console.log("Clicked!");\n});' },
    ];

    // useEffect(() => {
    //     axios.get('/CodeBlock')
    //         .then(response => {
    //             setCodeBlocks(response.data);
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
