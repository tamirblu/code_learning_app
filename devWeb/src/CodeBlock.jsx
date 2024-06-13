import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const socket = io();

function CodeBlock({ block }) {
    const { id } = useParams();
    const [role, setRole] = useState('');
    const [code, setCode] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    // const { id } = block;


    useEffect(() => {
        socket.emit('join', { id });

        socket.on('role', (role) => {
            setRole(role);
            setIsEditable(role === 'student');
        });

        socket.on('codeBlock', (block) => {
            setCode(block.code);
        });

        socket.on('codeUpdate', (newCode) => {
            setCode(newCode);
        });

        socket.on('mentorDisconnected', () => {
            setIsEditable(false);
        });

        return () => {
            socket.off('role');
            socket.off('codeBlock');
            socket.off('codeUpdate');
            socket.off('mentorDisconnected');
        };
    }, [id]);

    const handleChange = (event) => {
        const newCode = event.target.value;
        setCode(newCode);
        socket.emit('codeChange', newCode);
    };

    useEffect(() => {
        hljs.highlightBlock(document.getElementById('code'));
    }, [code]);

    return (
        <div>
            <h1>{role === 'mentor' ? 'Mentor View' : 'Student View'}</h1>
            <textarea
                value={code}
                onChange={handleChange}
                readOnly={!isEditable}
                style={{ width: '100%', height: '400px' }}
            />
            <pre>
        <code id="code" className="javascript">{code}</code>
      </pre>
        </div>
    );
}

export default CodeBlock;
