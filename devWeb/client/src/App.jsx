import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './Lobby.jsx';
import CodeBlock from "./CodeBlock.jsx";
// Import the NavBar component
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

export default App;