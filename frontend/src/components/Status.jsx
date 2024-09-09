import React, { useState } from 'react';

const Status = () => {
    const [userName, setUserName] = useState('');
    const [questionID, setQuestionID] = useState('');
    const [needReview, setNeedReview] = useState(false);
    const [reviewQuestions, setReviewQuestions] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');

    const handleCreateOrUpdateStatus = (method) => {
        const apiURL = 'http://127.0.0.1:5000/status' + (method === 'DELETE' ? `?UserName=${userName}&QuestionID=${questionID}` : '');
        fetch(apiURL, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: method !== 'DELETE' ? JSON.stringify({ UserName: userName, QuestionID: questionID, Need_review: needReview }) : null
        })
        .then(response => response.json())
        .then(data => setStatusMessage(JSON.stringify(data)))
        .catch(error => setStatusMessage('Error processing request'));
    };

    const fetchReviewQuestions = () => {
        fetch(`http://127.0.0.1:5000/status/review/${userName}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setStatusMessage(data.error);
                } else {
                    setReviewQuestions(data);
                    setStatusMessage('');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setStatusMessage('Failed to fetch review questions.');
            });
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="w-full max-w-4xl p-4">
                <h1 className="text-2xl font-bold text-center mb-4">Status Manager</h1>
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center">
                        <label className="w-32">UserName:</label>
                        <input
                            type="text"
                            placeholder="UserName"
                            className="border py-2 px-4 rounded flex-grow"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-32">QuestionID:</label>
                        <input
                            type="text"
                            placeholder="QuestionID"
                            className="border py-2 px-4 rounded flex-grow"
                            value={questionID}
                            onChange={(e) => setQuestionID(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-32">Need Review:</label>
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-purple-600"
                            checked={needReview}
                            onChange={(e) => setNeedReview(e.target.checked)}
                        />
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        className="px-4 py-2 bg-purple-500 text-white font-bold rounded hover:bg-purple-700"
                        onClick={() => handleCreateOrUpdateStatus('POST')}
                        disabled={!userName || !questionID}
                    >
                        Create Status
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
                        onClick={() => handleCreateOrUpdateStatus('PUT')}
                        disabled={!userName || !questionID}
                    >
                        Update Status
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-700"
                        onClick={() => handleCreateOrUpdateStatus('DELETE')}
                        disabled={!userName || !questionID}
                    >
                        Delete Status
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-700"
                        onClick={fetchReviewQuestions}
                        disabled={!userName}
                    >
                        Show Need Review Questions
                    </button>
                </div>
                {statusMessage && (
                    <p className="text-red-500 text-center">{statusMessage}</p>
                )}
                {reviewQuestions.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-xl font-bold">Questions Needing Review:</h2>
                        <ul>
                            {reviewQuestions.map(q => (
                                <li key={q.ID} className="bg-white shadow rounded p-2 my-2">
                                    ID: {q.ID}, Topic: {q.Topic}, Difficulty: {q.Difficulty}
                                    <a href={q.Link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-800">Open Link</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Status;

