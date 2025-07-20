import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import leftIcon from '../assets/sheet.svg';
import rightIcon from '../assets/download.svg';
import hamburgerIcon from '../assets/hamburger.svg';
import closeIcon from '../assets/close.svg';
import checkIcon from '../assets/check.svg';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const handleLogout = () => {
    signOut(auth);
};

const Navbar = ({ setShowModal, isSheetConnected }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleItemClick = (callback) => {
        callback?.();
        setMenuOpen(false);
    };

    return (
        <>
            <nav className="page-padding navbar">
                <img src={logo} alt="Logo" className="navbar-logo" />

                <div className="navbar-desktop-buttons">
                    {/* <button className="btn-global connect-btn" onClick={() => setShowModal(true)}>
                        Connect Sheet
                    </button> */}

                    <button
                        className={`btn-global connect-btn ${isSheetConnected ? 'connected' : ''}`}
                        onClick={() => setShowModal(true)}
                    >
                        {isSheetConnected ? (
                            <>
                                <img src={checkIcon} alt="Connected" style={{ width: 18 }} />
                                Connected
                            </>
                        ) : (
                            'Connect Sheet'
                        )}
                    </button>

                    <button className="btn-global download-btn">
                        <img src={leftIcon} alt="Left Icon" className="icon-left" />
                        <span>Download Sheet Template</span>
                        <img src={rightIcon} alt="Right Icon" className="icon-right" />
                    </button>

                    <button className="btn-global" onClick={handleLogout}>Logout</button>
                </div>

                <div className="navbar-hamburger" onClick={toggleMenu}>
                    <img src={menuOpen ? closeIcon : hamburgerIcon} alt="Menu" />
                </div>
            </nav>

            <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
                <button className="btn-global connect-btn" onClick={() => handleItemClick(() => setShowModal(true))}>
                    Connect Sheet
                </button>

                <button className="btn-global download-btn">
                    <img src={leftIcon} alt="Left Icon" className="icon-left" />
                    <span>Download Sheet Template</span>
                    <img src={rightIcon} alt="Right Icon" className="icon-right" />
                </button>

                <button className="btn-global" onClick={() => handleItemClick(handleLogout)}>Logout</button>
            </div>
        </>
    );
};

export default Navbar;
