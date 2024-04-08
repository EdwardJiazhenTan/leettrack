import React, { useState } from 'react';

const Stats = () => {
  const [username, setUsername] = useState('');
  const [statsImage, setStatsImage] = useState('');

  // Fetch stats when the button is clicked
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
        // Assuming a 'dark' theme here
        const imageUrl = `https://leetcode-stats.vercel.app/api?username=${username}&theme=dark`;
        setStatsImage(imageUrl);
        // Here, you would also submit the stats to your server
        // submitStatsToServer(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen mt-[-6rem]">
      <div className="w-full max-w-md px-4 py-8 space-y-6"> {/* Increased spacing with space-y-6 */}
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
      </div>
    </div>
  );  
}
  

export default Stats;
