import React, { useState } from 'react';

const Stats = () => {
  const [username, setUsername] = useState('');
  const [statsImage, setStatsImage] = useState('');
  const [userCreated, setUserCreated] = useState(false); // State to track if user was successfully created

  // Function to submit user stats to your server
  const createUser = (userData) => {
    fetch('http://127.0.0.1:5000/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: userData.username,
        totalSolved: userData.totalSolved,
        userRank: determineUserRank(userData) // Assuming you have a function to determine rank
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('User created successfully:', data);
        setUserCreated(true);
      } else {
        console.error('Failed to create user:', data.error);
      }
    })
    .catch(error => console.error('Error creating user:', error));
  };

  // Function to fetch stats when the button is clicked
  const fetchStats = () => {
    if (!username) {
      alert('Please enter a username.');
      return;
    }
    const apiURL = `https://leetcode-stats-api.herokuapp.com/${username}`;

    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data);
        const imageUrl = `https://leetcode-stats.vercel.app/api?username=${username}&theme=light`;
        setStatsImage(imageUrl);
        // Call createUser to submit the stats to your server
        createUser({
          username: username,
          totalSolved: data.totalSolved, // Adjust according to actual API response
          userRank: "Gold" // Placeholder, implement your logic to determine the rank
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  // Example function to determine user rank based on stats
  const determineUserRank = (userData) => {
    // Implement your logic here to determine the rank based on stats
    return "Gold"; // This is a placeholder
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen mt-[-6rem]">
      <div className="w-full max-w-md px-4 py-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Get Your LeetCode Stats</h1>
        <h2 className="text-md text-center text-white">Enter your LeetCode username:</h2>
        <input 
          type="text" 
          placeholder="LeetCode Username" 
          className="mt-2 p-2 border-2 border-gray-300 w-full text-black" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-900 text-white font-bold rounded hover:bg-blue-500 w-full" onClick={fetchStats}>
          Fetch My Stats
        </button>
        {statsImage && (
          <div id="statsImage" className="mt-4 text-center">
            <img src={statsImage} alt={`${username}'s LeetCode Stats`} />
          </div>
        )}
        {userCreated && <p className="text-green-500 text-center mt-2">User created successfully!</p>}
      </div>
    </div>
  );  
}

export default Stats;
