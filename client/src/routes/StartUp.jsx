import React from 'react';
import { Link } from 'react-router-dom';

const StartUp = () => {
    return (
        <div className="LoginContainerStyling" style={{marginTop: '250px'}}>
            <h1 className='LoginTitleStyling'> Gator Library</h1>
            <div className="startup-buttons">
                <Link to="/login">
                    <button>Login</button>
                </Link>
                <Link to="/signup">
                    <button>Create Account</button>
                </Link>
            </div>
        </div>
    );
};

export default StartUp;
