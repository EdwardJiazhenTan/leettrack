'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  url?: string;
  type: 'new' | 'review';
  completed: boolean;
}

export default function TodoPage() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy',
      tags: ['Array', 'Hash Table'],
      url: 'https://leetcode.com/problems/two-sum/',
      type: 'new',
      completed: false,
    },
    {
      id: '2',
      title: 'Add Two Numbers',
      difficulty: 'Medium',
      tags: ['Linked List', 'Math'],
      url: 'https://leetcode.com/problems/add-two-numbers/',
      type: 'new',
      completed: false,
    },
    {
      id: '3',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      tags: ['String', 'Stack'],
      url: 'https://leetcode.com/problems/valid-parentheses/',
      type: 'review',
      completed: true,
    },
    {
      id: '4',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      tags: ['Linked List', 'Recursion'],
      url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
      type: 'review',
      completed: false,
    },
  ]);

  const [dailyGoal] = useState({
    newQuestions: 2,
    reviewQuestions: 2,
  });

  const toggleComplete = (id: string) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, completed: !q.completed } : q
    ));
  };

  const newQuestions = questions.filter(q => q.type === 'new');
  const reviewQuestions = questions.filter(q => q.type === 'review');
  const completedNew = newQuestions.filter(q => q.completed).length;
  const completedReview = reviewQuestions.filter(q => q.completed).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar isAuthenticated={true} username="John Doe" />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Today's Study Plan</h1>
          <p className="text-black">Complete your daily goals to maintain your learning streak</p>
        </div>

        {/* Progress Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border border-black p-6">
            <h2 className="text-xl font-bold mb-4">New Questions</h2>
            <div className="text-3xl font-bold mb-2">
              {completedNew} / {dailyGoal.newQuestions}
            </div>
            <div className="w-full bg-gray-200 h-2">
              <div
                className="bg-black h-2 transition-all duration-300"
                style={{ width: `${(completedNew / dailyGoal.newQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="border border-black p-6">
            <h2 className="text-xl font-bold mb-4">Review Questions</h2>
            <div className="text-3xl font-bold mb-2">
              {completedReview} / {dailyGoal.reviewQuestions}
            </div>
            <div className="w-full bg-gray-200 h-2">
              <div
                className="bg-black h-2 transition-all duration-300"
                style={{ width: `${(completedReview / dailyGoal.reviewQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* New Questions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">New Questions</h2>
          <div className="space-y-4">
            {newQuestions.map((question) => (
              <div key={question.id} className="border border-black p-4 hover:border-black transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={question.completed}
                      onChange={() => toggleComplete(question.id)}
                      className="w-5 h-5"
                    />
                    <div>
                      <h3 className={`text-lg font-medium ${question.completed ? 'line-through text-black' : ''}`}>
                        {question.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </span>
                        <span className="text-black">
                          {question.tags.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {question.url && (
                    <a
                      href={question.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors"
                    >
                      Solve
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Questions Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Review Questions</h2>
          <div className="space-y-4">
            {reviewQuestions.map((question) => (
              <div key={question.id} className="border border-black p-4 hover:border-black transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={question.completed}
                      onChange={() => toggleComplete(question.id)}
                      className="w-5 h-5"
                    />
                    <div>
                      <h3 className={`text-lg font-medium ${question.completed ? 'line-through text-black' : ''}`}>
                        {question.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </span>
                        <span className="text-black">
                          {question.tags.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {question.url && (
                    <a
                      href={question.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors"
                    >
                      Review
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}