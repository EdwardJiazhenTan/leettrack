import React, { useState } from 'react';
import searchIcon from '../assets/search.png'; // Make sure the path matches your file structure

const Path = () => {
  const [questionNumbers, setQuestionNumbers] = useState('');
  const [pathID, setPathID] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const createPath = (e) => {
    e.preventDefault();
    console.log(`Creating path with question numbers: ${questionNumbers}`);
    setQuestionNumbers('');
  };

  const searchPath = (e) => {
    e.preventDefault();
    console.log(`Searching for path with ID: ${pathID}`);
    const mockPathDetails = `Details for path ${pathID}`;
    setSearchResult(mockPathDetails);
    setPathID('');
  };

  return (
    <div className="container mx-auto p-4">
      <div className = "text-white ">
        <h1 className="text-4xl font-bold text-center mb-8">LeetCode Path Creator</h1>
        <p>
          Welcome to the LeetCode Path Creator! Here, you can create a custom path with specific
          questions or search for an existing path by its ID.
          </p>
        <p>
          To create a path, enter the question numbers separated by commas (e.g., 1, 2, 3).
          </p>
         <p>
          To search for a path, enter the path ID in the search form below.
          </p>   
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-center mb-4">Create a LeetCode Path</h2>
        <form onSubmit={createPath} className="flex items-center">
          <input
            type="text"
            placeholder="Enter questions"
            value={questionNumbers}
            onChange={(e) => setQuestionNumbers(e.target.value)}
            className="input input-bordered text-center rounded-md"
          />
          <button type="submit" className="btn flex items-center justify-center p-2 ml-2">
            <img src={searchIcon} alt="Search" className="w-6 h-6" />
          </button>
        </form>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-center mb-4">Search for a Path by ID</h2>
        <form onSubmit={searchPath} className="flex items-center">
          <input
            type="text"
            placeholder="Enter Path ID"
            value={pathID}
            onChange={(e) => setPathID(e.target.value)}
            className="input input-bordered text-center rounded-md"
          />
          <button type="submit" className="btn flex items-center justify-center p-2 ml-2">
            <img src={searchIcon} alt="Search" className="w-6 h-6" />
          </button>
        </form>
      </div>

      {searchResult && (
        <div className="mt-4 text-center">
          <p>Search Result:</p>
          <div className="p-4 mt-2 border rounded">
            {searchResult}
          </div>
        </div>
      )}
    </div>
  );
};

export default Path;
