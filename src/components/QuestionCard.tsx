import React from 'react';
import { Question, Answer } from '../types/assessment';

interface QuestionCardProps {
  question: Question;
  answer: Answer | undefined;
  onAnswerChange: (questionId: number, value: 'yes' | 'no') => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer, onAnswerChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-4 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold flex-shrink-0 mt-1">
              {question.id}
            </span>
            <p className="text-gray-800 font-medium leading-relaxed">{question.text}</p>
          </div>
        </div>
        
        <div className="flex gap-4 lg:flex-shrink-0">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name={`question-${question.id}`}
              value="yes"
              checked={answer?.value === 'yes'}
              onChange={() => onAnswerChange(question.id, 'yes')}
              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 cursor-pointer"
            />
            <span className="text-green-600 font-medium group-hover:text-green-700 transition-colors">
              Yes
            </span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name={`question-${question.id}`}
              value="no"
              checked={answer?.value === 'no'}
              onChange={() => onAnswerChange(question.id, 'no')}
              className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer"
            />
            <span className="text-red-600 font-medium group-hover:text-red-700 transition-colors">
              No
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};