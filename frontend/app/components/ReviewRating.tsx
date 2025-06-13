"use client";

import React, { useState } from "react";

interface Question {
  user_question_id: number;
  question_id: number;
  title: string;
  url: string;
  difficulty: string;
  solved_at: string;
  times_reviewed: number;
}

interface ConfidenceLevel {
  value: string;
  label: string;
  description: string;
  color: string;
  intervals: number[];
}

interface ReviewRatingProps {
  question: Question;
  confidenceLevels: ConfidenceLevel[];
  onRate: (
    userQuestionId: number,
    confidence: string,
    notes?: string
  ) => Promise<void>;
}

const ReviewRating: React.FC<ReviewRatingProps> = ({
  question,
  confidenceLevels,
  onRate,
}) => {
  const [selectedConfidence, setSelectedConfidence] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!selectedConfidence) return;

    setIsSubmitting(true);
    try {
      await onRate(
        question.user_question_id,
        selectedConfidence,
        notes || undefined
      );
      // Reset form after successful submission
      setSelectedConfidence("");
      setNotes("");
    } catch (error) {
      console.error("Failed to rate question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-4">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-mono text-white mb-1">
            <a
              href={question.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              {question.title}
            </a>
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <span
              className={`font-mono ${getDifficultyColor(question.difficulty)}`}
            >
              {question.difficulty}
            </span>
            <span className="text-gray-400 font-mono">
              Solved: {new Date(question.solved_at).toLocaleDateString()}
            </span>
            {question.times_reviewed > 0 && (
              <span className="text-gray-400 font-mono">
                Reviews: {question.times_reviewed}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Confidence Level Selection */}
      <div className="mb-4">
        <h4 className="text-white font-mono mb-3">
          How do you feel about this question?
        </h4>
        <div className="space-y-2">
          {confidenceLevels.map((level) => (
            <label
              key={level.value}
              className={`flex items-start p-3 rounded border cursor-pointer transition-all ${
                selectedConfidence === level.value
                  ? "border-accent bg-gray-700"
                  : "border-gray-600 hover:border-gray-500"
              }`}
            >
              <input
                type="radio"
                name="confidence"
                value={level.value}
                checked={selectedConfidence === level.value}
                onChange={(e) => setSelectedConfidence(e.target.value)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                  <span className="text-white font-mono font-semibold">
                    {level.label}
                  </span>
                </div>
                <p className="text-gray-300 text-sm font-mono leading-relaxed">
                  {level.description}
                </p>
                {level.intervals.length > 0 && (
                  <p className="text-gray-400 text-xs font-mono mt-1">
                    Review schedule: {level.intervals.join(" → ")} days
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Optional Notes */}
      <div className="mb-4">
        <label htmlFor="notes" className="block text-white font-mono mb-2">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any thoughts, insights, or reminders..."
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded font-mono text-white placeholder-gray-400 focus:border-accent focus:outline-none resize-vertical min-h-[80px]"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedConfidence || isSubmitting}
        className={`w-full py-3 px-4 rounded font-mono font-semibold transition-all ${
          !selectedConfidence || isSubmitting
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-accent text-gray-900 hover:bg-accent/90"
        }`}
      >
        {isSubmitting ? "Rating..." : "Rate Question"}
      </button>
    </div>
  );
};

export default ReviewRating;
