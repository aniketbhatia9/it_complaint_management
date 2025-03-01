// App.js
import React, { useState } from 'react';
import Login from './login'; // Import the login component
import ComplaintForm from './components/ComplaintForm'; // Import the complaint form


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true); // Set the logged-in state to true
    };

     // Handle logout
     const handleLogout = () => {
        setIsLoggedIn(false); // Set the logged-in state to false (logs the user out)
    };

    return (
        <>
        
        <div class='header'>{isLoggedIn ? (<> 
        <button className="logout-button" onClick={handleLogout}>Logout</button></>):("")}</div>            
        <div className="App">
            {/* Main background video */}
            <video autoPlay muted loop className="bg-video">
                <source src={`${process.env.PUBLIC_URL}/bg_video.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            {/* Content container */}
            <div className="content">                
                {isLoggedIn ? (
                    <>                    
                        <ComplaintForm />
                        {/* Logout button visible when logged in */}
                        {/* <button className="logout-button" onClick={handleLogout}>Logout</button> */}
                    </>
                ) : (
                    <Login onLogin={handleLogin} />
                )}
            </div>            
        </div>
        <div class='footer'>Designed and Developed by IT - Section</div>
        </>
    );
    
}

export default App;
