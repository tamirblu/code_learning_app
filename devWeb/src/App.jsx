import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './Lobby';
import CodeBlock from "./CodeBlock";

function App() {
    console.log('App');
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Lobby />} />
                {/*<Route path="/codeblocks" element={<CodeBlockList blocks={blocks} />} />*/}

                <Route path="/CodeBlock/:id" element={<CodeBlock />} />
            </Routes>
        </Router>
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