import React, { useState } from 'react';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [searchParams, setSearchParams] = useState({
    id: '',
    topic: '',
    difficulty: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch all questions
  const fetchAllQuestions = () => {
    setIsLoading(true);
    setError('');
    const apiURL = `http://127.0.0.1:5000/Questions`;

    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Failed to load questions. Please try again.');
        setIsLoading(false);
      });
  };

 // Function to fetch questions by ID, topic, or difficulty
const fetchQuestionsByParam = (paramType, paramValue) => {
  if (!paramValue) {
    setError(`Please enter a ${paramType}.`);
    return;
  }
  setIsLoading(true);
  setError('');
  
  let apiURL;
  // Build URL based on parameter type
  if (paramType === 'id') {
    apiURL = `http://127.0.0.1:5000/Questions/id/${paramValue}`;
  } else {
    apiURL = `http://127.0.0.1:5000/Questions/${paramType}/${paramValue}`;
  }

  fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`No results found for ${paramType}: ${paramValue}`);
      }
      return response.json();
    })
    .then(data => {
      setQuestions(Array.isArray(data) ? data : [data]); // Ensure data is always in array format
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setError(`Failed to load questions by ${paramType}. Please try again.`);
      setIsLoading(false);
    });
};

// New function to fetch questions by path ID
const fetchQuestionsByPathId = () => {
  if (!searchParams.pathId) {
    setError('Please enter a path ID.');
    return;
  }
  setIsLoading(true);
  setError('');

  const apiURL = `http://127.0.0.1:5000/PathQuestions/${searchParams.pathId}`;

  fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`No results found for path ID: ${searchParams.pathId}`);
      }
      return response.json();
    })
    .then(data => {
      setQuestions(Array.isArray(data) ? data : [data]);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setError(`Failed to load questions by path ID. Please try again.`);
      setIsLoading(false);
    });
};

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-4xl px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Questions List</h1>
        
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Enter Question ID"
            className="border py-2 px-4 mr-2"
            value={searchParams.id}
            onChange={(e) => setSearchParams({...searchParams, id: e.target.value})}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
            onClick={() => fetchQuestionsByParam('id', searchParams.id)}
            disabled={isLoading}
          >
            Search by ID
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Enter Topic"
            className="border py-2 px-4 mr-2"
            value={searchParams.topic}
            onChange={(e) => setSearchParams({...searchParams, topic: e.target.value})}
          />
          <button
            className="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-700"
            onClick={() => fetchQuestionsByParam('topic', searchParams.topic)}
            disabled={isLoading}
          >
            Search by Topic
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Enter Difficulty"
            className="border py-2 px-4 mr-2"
            value={searchParams.difficulty}
            onChange={(e) => setSearchParams({...searchParams, difficulty: e.target.value})}
          />
          <button
            className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-700"
            onClick={() => fetchQuestionsByParam('difficulty', searchParams.difficulty)}
            disabled={isLoading}
          >
            Search by Difficulty
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Enter Path ID"
            className="border py-2 px-4 mr-2"
            value={searchParams.pathId}
            onChange={(e) => setSearchParams({...searchParams, pathId: e.target.value})}
          />
          <button
            className="px-4 py-2 bg-purple-500 text-white font-bold rounded hover:bg-blue-700"
            onClick={fetchQuestionsByPathId}
            disabled={isLoading}
          >
            Search by Path ID
          </button>
        </div>

        <div className="flex justify-center mb-4">
        <button
          className="px-4 py-2  flex justify-center bg-black text-white font-bold rounded hover:bg-blue-700 mb-4"
          onClick={fetchAllQuestions}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Show All Questions'}
        </button>
        </div>
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {questions.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-4 text-center">
            <div className="font-bold">ID</div>
            <div className="font-bold">Link</div>
            <div className="font-bold">Difficulty</div>
            <div className="font-bold">Topic</div>
            {questions.map(question => (
              <React.Fragment key={question.ID}>
                <div>{question.ID}</div>
                <button className="bg-blue-200 hover:bg-blue-400 text-blue-800 py-1 px-2 rounded" onClick={() => window.open(question.Link, "_blank")}>
                  Link
                </button>
                <div>{question.Difficulty}</div>
                <div>{question.Topic}</div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;
