import { Link } from 'react-router-dom';

function Lobby() {
    // Define the titles of the code blocks
    const codeBlocksTitle = [
        { title: 'Async Case'},
        { title: 'Closure Example'},
        { title: 'Promise Example'},
        { title: 'Event Listener'},
    ];
    // Render the component
    return (
        <div>
            <h1 className="Choose-block">Choose code block</h1>
            <ul className="dark-list">
                {// Map over the codeBlocksTitle array and render a list item for each block
                    codeBlocksTitle.map((block, index) => (
                    <li key={index}>
                        <Link to={`/CodeBlock/${index}`}>{block.title}</Link>
                    </li>
                ))}
            </ul>
            <style jsx>{`
            .Choose-block {
                color: #505050;
            }
            .dark-list {
                list-style-type: none;
                background-color: #999;
                color: #f2f2f2;
                padding: 0;
                margin: 0;
                max-width: 80%;
            }

            .dark-list li {
              padding: 20px; 
              font-size: 1.5em; 
              border-bottom: 1px solid #111;

            }
            
            .dark-list li:last-child {
                border-bottom: none;
            }
            
            .dark-list li:hover {
                background-color: #111;
            }

            .dark-list li a {
                color: #f2f2f2;
                text-decoration: none;
            }

            .dark-list li a:hover {
                color: #ddd;
            }
        `}</style>
        </div>
    );
}
export default Lobby;
