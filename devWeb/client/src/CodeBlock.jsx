import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

const CodeBlock = () => {
    // useParams hook to get the id from the URL
    const { id } = useParams();
    // useRef hook to reference the code block for syntax highlighting
    const codeRef = useRef(null);
    // useRef hook to reference the socket.io connection
    const socket = useRef(null);
    // useState hooks to manage state variables
    const [role, setRole] = useState('');
    const [code, setCode] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [title,setTitle] = useState('Title');
    // Solutions for the default code blocks
    const solutions = {
        0:'// Write an async function named fetchData that returns the string \'Hello, World!\'.\n' +
        'async function fetchData() {\n' +
        '  return (Hello, World!)'+ ' //' +' add Hello, World!\;\n' +
        '}'
        ,
        1:'function makeCounter() {\n  let count = 0;\n  return function() {\n    return (count++) // add count++;\n  };\n}'
        ,
        2:'function fetchData() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve("Data"), (1000)); // Make the time out value equal to one second (1000)\n  });\n}'
        ,
        3:'document.addEventListener("click", function() {\n  console.log("Clicked!");\n});// add Clicked!'
    }

    // useEffect hook to handle socket.io connections and events
    useEffect(() => {
        // Connect to the socket.io server
        socket.current = io.connect('http://localhost:5000');
        // Emit 'join' event with the id
        socket.current.emit('join', { id });
        socket.current.on('role', (role) => {
            setRole(role);
            setIsEditable(role === 'student');
        });

        socket.current.on('codeBlock', (block) => {
            setCode(block.code);
            setTitle(block.title);
        });

        socket.current.on('mentorDisconnected', () => {
            setIsEditable(false);
        });

        socket.current.on('codeUpdate', (newCode) => {
                setCode(newCode);
        });

        // Disconnect from the socket.io server when the component unmounts
        return () => {
            socket.current.disconnect();
        };

    }, [id]);
    // let codeSec;
    // Function to handle code changes
    const handleChange = (event) => {
        const newCode = event.target.value;
        // codeSec = event.target.value;
        setCode(newCode);
        socket.current.emit('codeChange', { id, newCode });
    };


    // useEffect hook to highlight the code block
    useEffect(() => {
        if (code && codeRef.current) {
            codeRef.current.innerHTML = hljs.highlight('javascript', code).value;
        }
    }, [code]);

    // Render the component
    return (
        <div>
            <h1 style={{color: '#444'}}>{title}</h1>
            <h3 style={{color: '#111'}}>{role === 'mentor' ? 'Mentor View' : 'Student View'}</h3>
            {
                code === solutions[id] ?
                    // Render a message if the code is correct
                    <div>
                        <h1 style={{color: '#999999'}}>Correct! :)</h1>
                        <h3 style={{color: '#444'}}>try another one!</h3>
                    </div>
                    :
                    // Render the code block
                    <>
                      <textarea
                          id={id}
                          value={code}
                          onChange={handleChange}
                          readOnly={!isEditable}
                          style={{ width: '100%', height: '400px' }}
                          placeholder="Type your code here..."
                      />
                      <pre>
                        <code style={{color: '#444'}} ref={codeRef} className="javascript"></code>
                      </pre>
                    </>
            }
        </div>
    );
};

export default CodeBlock;
