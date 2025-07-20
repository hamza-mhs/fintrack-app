// src/MainApp.jsx

import Navbar from './components/Navbar';
import Body from './components/Body';
import Footer from './components/Footer';
import './styles/styles.css';
import './App.css';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from './firebase';


const MainApp = () => {
    const [savedSheetUrl, setSavedSheetUrl] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [sheetUrl, setSheetUrl] = useState('');
    const [isSheetConnected, setIsSheetConnected] = useState(false);
    const [sheetData, setSheetData] = useState({

        stocks: { initial: '', current: '', percentage: '' },
        gold: { initial: '', current: '', percentage: '' }
    });

    const cellConfig = {
        stocks: {
            sheet: 'STOCKS',
            initialCell: 'P4',
            currentCell: 'Q4',
            percentageCell: 'L4'
        },
        gold: {
            sheet: 'GOLD',
            initialCell: 'M5',
            currentCell: 'N5',
            percentageCell: 'K5'
        }
    };

    const extractSheetIdFromUrl = (url) => {
        const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        return match ? match[1] : null;
    };

    const fetchSheetValue = async (sheetId, sheetName, cell) => {
        const apiKey = 'AIzaSyCjkRhZLzzvI7Z29NZakjF5WjMYWAFCpCw';
        const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!${cell}?key=${apiKey}`);
        const data = await res.json();
        return data?.values?.[0]?.[0] || '';
    };

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    if (data.sheetUrl) {
                        setSheetUrl(data.sheetUrl);
                        setSavedSheetUrl(data.sheetUrl);

                        // ✅ Mark as connected when sheet is already linked
                        setIsSheetConnected(true);
                    }

                    setSheetData({
                        stocks: {
                            initial: data.stocks?.initial || '',
                            current: data.stocks?.current || '',
                            percentage: data.stocks?.percentage || ''
                        },
                        gold: {
                            initial: data.gold?.initial || '',
                            current: data.gold?.current || '',
                            percentage: data.gold?.percentage || ''
                        }
                    });

                    console.log("✅ Fetched data from Firestore:", data);
                }
            } catch (err) {
                console.error("🔥 Error loading Firestore data:", err);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        setShowModal(false);

        const sheetId = extractSheetIdFromUrl(sheetUrl);
        if (!sheetId) {
            console.error("❌ Invalid Sheet URL");
            return;
        }

        try {
            // Fetch sheet values
            const stocksInitial = await fetchSheetValue(sheetId, cellConfig.stocks.sheet, cellConfig.stocks.initialCell);
            const stocksCurrent = await fetchSheetValue(sheetId, cellConfig.stocks.sheet, cellConfig.stocks.currentCell);
            const stocksPercentage = await fetchSheetValue(sheetId, cellConfig.stocks.sheet, cellConfig.stocks.percentageCell);

            const goldInitial = await fetchSheetValue(sheetId, cellConfig.gold.sheet, cellConfig.gold.initialCell);
            const goldCurrent = await fetchSheetValue(sheetId, cellConfig.gold.sheet, cellConfig.gold.currentCell);
            const goldPercentage = await fetchSheetValue(sheetId, cellConfig.gold.sheet, cellConfig.gold.percentageCell);

            // Create object
            const newData = {
                sheetUrl,
                stocks: {
                    initial: stocksInitial,
                    current: stocksCurrent,
                    percentage: stocksPercentage
                },
                gold: {
                    initial: goldInitial,
                    current: goldCurrent,
                    percentage: goldPercentage
                }
            };

            // Save to Firestore
            const user = auth.currentUser;
            if (!user) {
                console.error("❌ No user logged in");
                return;
            }

            await setDoc(doc(db, "users", user.uid), newData);

            setSheetData(newData);
            setSavedSheetUrl(sheetUrl);
            setIsSheetConnected(true); // ✅ Sheet is now connected
            console.log("✅ Sheet data saved to Firestore and state updated:", newData);

            console.log("✅ Sheet data saved to Firestore and state updated:", newData);
        } catch (err) {
            console.error("❌ Error saving to Firestore:", err);
        }
    };

    const handleRemove = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const docRef = doc(db, "users", user.uid);

            await updateDoc(docRef, {
                sheetUrl: '',
                stocks: { initial: '', current: '', percentage: '' },
                gold: { initial: '', current: '', percentage: '' }
            });

            setSheetUrl('');
            setSavedSheetUrl('');
            setSheetData({
                stocks: { initial: '', current: '', percentage: '' },
                gold: { initial: '', current: '', percentage: '' }
            });

            setIsSheetConnected(false); // ❌ Disconnected
            console.log("❌ Sheet URL and data removed successfully.");
        } catch (err) {
            console.error("⚠️ Error removing sheet URL:", err);
        }
    };

    useEffect(() => {
        const sheetId = extractSheetIdFromUrl(sheetUrl);
        if (!sheetId) return;

        const pollSheetData = async () => {
            try {
                const stocksInitial = await fetchSheetValue(sheetId, cellConfig.stocks.sheet, cellConfig.stocks.initialCell);
                const stocksCurrent = await fetchSheetValue(sheetId, cellConfig.stocks.sheet, cellConfig.stocks.currentCell);
                const stocksPercentage = await fetchSheetValue(sheetId, cellConfig.stocks.sheet, cellConfig.stocks.percentageCell);

                const goldInitial = await fetchSheetValue(sheetId, cellConfig.gold.sheet, cellConfig.gold.initialCell);
                const goldCurrent = await fetchSheetValue(sheetId, cellConfig.gold.sheet, cellConfig.gold.currentCell);
                const goldPercentage = await fetchSheetValue(sheetId, cellConfig.gold.sheet, cellConfig.gold.percentageCell);

                const updatedData = {
                    stocks: {
                        initial: stocksInitial,
                        current: stocksCurrent,
                        percentage: stocksPercentage
                    },
                    gold: {
                        initial: goldInitial,
                        current: goldCurrent,
                        percentage: goldPercentage
                    }
                };

                setSheetData(updatedData);
                console.log("🔁 Polled sheet data updated:", updatedData);

                // Optional: Save to Firestore as well
                const user = auth.currentUser;
                if (user) {
                    await updateDoc(doc(db, "users", user.uid), {
                        stocks: updatedData.stocks,
                        gold: updatedData.gold
                    });
                }

            } catch (err) {
                console.error("⛔ Error polling sheet data:", err);
            }
        };

        pollSheetData(); // initial fetch

        const intervalId = setInterval(pollSheetData, 60000); // every 15 seconds
        return () => clearInterval(intervalId); // cleanup on unmount

    }, [sheetUrl]);


    return (
        <div className="app-container">
            <Navbar isSheetConnected={isSheetConnected} setShowModal={setShowModal} />
            <Body data={sheetData} />
            <Footer />

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <label htmlFor="sheetUrl">Google Sheet URL</label>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="text"
                                id="sheetUrl"
                                placeholder="Paste your Google Sheet link here"
                                value={sheetUrl}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSheetUrl(value);
                                    setHasChanges(true);
                                }}
                                style={{ flexGrow: 1 }}
                            />

                            {savedSheetUrl ? (
                                <button
                                    className='btn-remove'
                                    onClick={() => {
                                        handleRemove();
                                        setHasChanges(false);
                                    }}
                                    style={{
                                        // padding: '6px 10px',
                                        // backgroundColor: '#f44336',
                                        // color: '#fff',
                                        // border: 'none',
                                        // borderRadius: '4px'
                                    }}
                                >
                                    Remove
                                </button>
                            ) : (
                                <button
                                    className='btn-save'
                                    onClick={() => {
                                        handleSave();
                                        setHasChanges(false);
                                    }}
                                    disabled={!sheetUrl.trim()}
                                    style={{
                                        padding: '6px 16px',
                                        backgroundColor: sheetUrl.trim() ? '#ffffff' : '#4A4A4A',
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: sheetUrl.trim() ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    Save
                                </button>
                            )}
                        </div>

                        <p>Please ensure your sheet is published or publicly accessible.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainApp;
