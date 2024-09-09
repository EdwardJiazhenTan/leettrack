import React, { useState } from 'react';

const UserStats = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch all users when the button is clicked
  const fetchAllUsers = () => {
    setIsLoading(true);
    setError('');
    const apiURL = `http://127.0.0.1:5000/users`;

    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again.');
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-4xl px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">User List</h1>
        <button
          className="px-4 py-2 bg-blue-900 text-white font-bold rounded hover:bg-blue-500 w-full mb-4"
          onClick={fetchAllUsers}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Show All Users'}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {users.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="font-bold">Username</div>
            <div className="font-bold">Total Solved</div>
            <div className="font-bold">User Rank</div>
            {users.map(user => (
              <React.Fragment key={user.userName}>
                <div>{user.userName}</div>
                <div>{user.Total_solve}</div>
                <div>{user.UserRank}</div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStats;
