import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import axios from "axios";

const CodeBlock = () => {
    const { id } = useParams();
    const codeRef = useRef(null);

    const [role, setRole] = useState('');
    const [code, setCode] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    // const [codeBlocks2, setCodeBlocks] = useState([]);


    // useEffect(() => {
    //     axios.get('/api/codeblocks')
    //         .then(response => {
    //             setCodeBlocks(response.data);
    //             console.log('codeBlocks2',codeBlocks2)
    //         })
    //         .catch(error => {
    //             console.error('There was an error fetching the code blocks!', error);
    //         });
    // }, []);



    useEffect(() => {
        const socket = io.connect('http://127.0.0.1:5000');
        console.log('Connected to Socket.IO server with ID: ' + socket.id);
        socket.emit('join', { id });

        // socket.emit('getCodeBlock', { id }); // Emit event to server with CodeBox id

        // socket.on('codeBlock', (block) => { // Listen for codeBlock event from server
        //     console.log('codeBlock',block.code)
        //     setCode(block.code); // Update code state with received code
        // });

        socket.on('role', (role) => {
            setRole(role);
            setIsEditable(role === 'student');
        });

        socket.on('codeBlock', (block) => {
            console.log('codeBlock',block.code)
            setCode(block);
        });

        socket.on('codeUpdate', (newCode) => {
            setCode(newCode);
        });
        // socket.on('checkId', (idCheck) => {
        //     console.log( 'checkId: ',   idCheck);
        //     console.log('Id: ',id);
        //     const boolVal = id ==idCheck
        //     setIsChangeMentor(boolVal);
        //     console.log(isChangeMentor);
        //
        // });
        socket.on('mentorDisconnected', () => {
            setIsEditable(false);
        });

        return () => {
            socket.disconnect();
        };
    }, [id]);

    // const handleChange = (event) => {
    //     const newCode = event.target.value;
    //     // const idCheck = idCodeBlock;
    //     const socket = io.connect('http://127.0.0.1:5000');
    //     // socket.emit('checkId',idCheck)
    //     // if(isChangeMentor){
    //     setCode(newCode);
    //     socket.emit('codeChange', newCode);
    //     // }
    //
    // };
    const handleChange = (event) => {
        const newCode = event.target.value;
        const socket = io.connect('http://127.0.0.1:5000');
        setCode(newCode);
        socket.emit('codeChange', { id, newCode });
    };


    useEffect(() => {
        if (code && codeRef.current) {
            codeRef.current.innerHTML = hljs.highlight('javascript', code).value;
        }
    }, [code]);

    return (
        <div>
            <h1>{role === 'mentor' ? 'Mentor View' : 'Student View'}</h1>
            <textarea
                id={id}
                value={code}
                onChange={handleChange}
                readOnly={!isEditable}
                style={{ width: '100%', height: '400px' }}
                placeholder="Type your code here..."
            />
            <pre>
                <code ref={codeRef} className="javascript"></code>
            </pre>
        </div>
    );
};

export default CodeBlock;
