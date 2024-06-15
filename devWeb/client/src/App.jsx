import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './Lobby.jsx';
import CodeBlock from "./CodeBlock.jsx";
import NavBar from './components/NavBar.jsx';

function App() {
    return (
        <>
            <NavBar />
            <Router>
                <Routes>
                    <Route path="/" element={<Lobby />} />
                    <Route path="/CodeBlock/:id" element={<CodeBlock />} />
                    <Route path="*" element={<p>This page does not exist</p>} />
                </Routes>
            </Router>
        </>
    );
}


//
// export default App;
// import React from 'react';

// function App() {
//     console.log('App');
//     return (
//         <div>
//             <h1>App</h1>
//         </div>
//     );
// }
//
export default App;