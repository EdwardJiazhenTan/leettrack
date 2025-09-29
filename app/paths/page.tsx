'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface Path {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question_ids: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  estimated_hours: number;
  tags: string[];
}

export default function PathsPage() {
  const [paths, setPaths] = useState<Path[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newPath, setNewPath] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    tags: '',
    estimated_hours: 5,
    is_public: false,
  });

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/paths?is_public=true');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setPaths(result.paths || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const createPath = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to create a path');
        return;
      }

      const response = await fetch('/api/paths', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPath,
          tags: newPath.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        }),
      });

      if (response.ok) {
        alert('Path created successfully!');
        setShowCreateModal(false);
        setNewPath({
          title: '',
          description: '',
          difficulty: 'Beginner',
          tags: '',
          estimated_hours: 5,
          is_public: false,
        });
        fetchPaths();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create path');
      }
    } catch (err) {
      alert('Failed to create path');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-50';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-50';
      case 'Advanced':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}>
        <div className="animate-pulse text-gray-600">Loading paths...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}>
        <div className="text-red-600 bg-white p-6 rounded-lg shadow-sm border">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-light text-gray-900">
              LeetTrack
            </Link>
            <div className="flex gap-4">
              <Link
                href="/questions"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Questions
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">Learning Paths</h1>
            <p className="text-gray-600">
              Structured learning paths to guide your coding journey
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create Path
          </button>
        </div>

        {/* Paths List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => (
            <div key={path.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">{path.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(path.difficulty)}`}>
                  {path.difficulty}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{path.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{path.question_ids.length} questions</span>
                <span>{path.estimated_hours} hours</span>
              </div>

              {path.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {path.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {path.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      +{path.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                  Start Path
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {paths.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No learning paths available yet.</p>
            <p className="text-gray-400 text-sm mt-2">Create the first path to get started!</p>
          </div>
        )}
      </div>

      {/* Create Path Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create Learning Path</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newPath.title}
                  onChange={(e) => setNewPath({...newPath, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Path title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newPath.description}
                  onChange={(e) => setNewPath({...newPath, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  placeholder="Path description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={newPath.difficulty}
                  onChange={(e) => setNewPath({...newPath, difficulty: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newPath.tags}
                  onChange={(e) => setNewPath({...newPath, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., Arrays, Algorithms, Data Structures"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                <input
                  type="number"
                  value={newPath.estimated_hours}
                  onChange={(e) => setNewPath({...newPath, estimated_hours: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  min="1"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={newPath.is_public}
                  onChange={(e) => setNewPath({...newPath, is_public: e.target.checked})}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                  Make this path public
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createPath}
                disabled={!newPath.title || !newPath.description}
                className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Path
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
