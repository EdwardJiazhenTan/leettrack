import React, { useState, useEffect } from 'react';

const Path = () => {
  const [paths, setPaths] = useState([]);

  // Function to fetch all paths
  const fetchPaths = () => {
    fetch('http://127.0.0.1:5000/Path')
      .then(response => response.json())
      .then(data => {
        setPaths(data);
      })
      .catch(error => {
        console.error('Error fetching paths:', error);
      });
  };

  // Use useEffect to fetch paths when the component mounts
  useEffect(() => {
    fetchPaths();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="text-white">
        <h1 className="text-4xl font-bold text-center mb-8">LeetCode Path Details</h1>
        <p className='text-center'>
          Below you can see all available LeetCode Paths stored in the database.
        </p>
      </div>
      <div className="flex flex-col items-center">
        {paths.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-10 text-center"> 
            <div className="font-bold">Path ID</div>
            <div className="font-bold">Path Name</div>
            {paths.map(path => (
              <React.Fragment key={path.ID}>
                <div>{path.ID}</div>
                <div>{path.PathName}</div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-center text-white">No paths available.</p>
        )}
      </div>
    </div>
  );
};

export default Path;
