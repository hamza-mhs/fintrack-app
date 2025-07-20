// src/components/Login.jsx
import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import logo from '../assets/logo.svg';
import googleLogo from '../assets/google-logo.svg';
import '../styles/styles.css';

const Login = () => {
    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login error", error);
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Logo" className="login-logo" />
            <h1 className="login-heading">Track Your Investments</h1>
            <p className='login-paragraph'>Login with your Google account to continue</p>
            <button onClick={handleLogin} className="google-btn">
                <img src={googleLogo} alt="Google logo" className="google-icon" />
                Sign in with Google
            </button>
        </div>
    );
};

export default Login;
