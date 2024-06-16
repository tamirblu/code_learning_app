import React from "react";

function navBar() {
    return (
        <>
            <nav className="navbar">
                <a href={'/'}>HOME</a>
            </nav>
            <style jsx>{`
        .navbar {
            background-color: #888;
            overflow: hidden;
            position: sticky;
            top: 0;
            width: 100%;
            justify-content: space-around;
            align-items: center;
            font-size: 1.9rem;
        }

        .navbar a {
            color: #f2f2f2;
            text-decoration: none;
            padding: 0.5rem 1rem;
        }

        .navbar a:hover {
            background-color: #ddd;
            color: black;
        }
    `}</style>
        </>
    );
}

export default navBar;
