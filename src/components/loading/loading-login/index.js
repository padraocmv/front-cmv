import React from 'react';
import { BeatLoader } from 'react-spinners';
import './style.css';

const LoadingLogin = () => {
    return (
        <div data-testid='loading-login' className="loading-login-container">
            <BeatLoader color="white" size={10} />
        </div>
    );
};

export default LoadingLogin;
