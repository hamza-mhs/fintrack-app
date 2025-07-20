import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import MainApp from './MainApp';
import Spinner from './components/Spinner'; // ✅ Import Spinner

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // ✅ Once auth is determined, stop loading
    });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

  if (loading) {
    return <Spinner />; // ✅ Show spinner while Firebase is initializing
  }

  return user ? <MainApp user={user} /> : <Login />;
}

export default App;
