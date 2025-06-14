import React, { useState, useMemo } from 'react';
import { FileText, Award } from 'lucide-react';
import { categories } from './data/questions';
import { Answer, CategoryProgress } from './types/assessment';
import { calculateScore } from './utils/scoring';
import { CategoryCard } from './components/CategoryCard';
import { CategoryDialog } from './components/CategoryDialog';
import { OverallProgress } from './components/OverallProgress';
import { ResultsModal } from './components/ResultsModal';

function App() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const totalQuestions = 34;
  const answeredQuestions = answers.filter(answer => answer.value !== null).length;
  const allQuestionsAnswered = answeredQuestions === totalQuestions;
  
  const categoryProgress: CategoryProgress[] = useMemo(() => {
    return categories.map(category => {
      const completed = category.questions.filter(question => {
        const answer = answers.find(a => a.questionId === question.id);
        return answer && answer.value !== null;
      }).length;
      
      return {
        categoryName: category.name,
        completed,
        total: category.questions.length
      };
    });
  }, [answers]);

  const assessmentResult = useMemo(() => {
    if (allQuestionsAnswered) {
      return calculateScore(answers);
    }
    return null;
  }, [answers, allQuestionsAnswered]);

  const handleAnswerChange = (questionId: number, value: 'yes' | 'no') => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(answer => answer.questionId === questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { questionId, value };
        return updated;
      } else {
        return [...prev, { questionId, value }];
      }
    });
  };

  const handleCategoryClick = (categoryIndex: number) => {
    setSelectedCategoryIndex(categoryIndex);
  };

  const handleCloseDialog = () => {
    setSelectedCategoryIndex(null);
  };

  const handlePreviousCategory = () => {
    if (selectedCategoryIndex !== null && selectedCategoryIndex > 0) {
      setSelectedCategoryIndex(selectedCategoryIndex - 1);
    }
  };

  const handleNextCategory = () => {
    if (selectedCategoryIndex !== null && selectedCategoryIndex < categories.length - 1) {
      setSelectedCategoryIndex(selectedCategoryIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (allQuestionsAnswered && assessmentResult) {
      setShowResults(true);
    }
  };

  const getCompletedCount = (categoryName: string): number => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return 0;
    
    return category.questions.filter(question => {
      const answer = answers.find(a => a.questionId === question.id);
      return answer && answer.value !== null;
    }).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="container mx-auto px-3 py-4 max-w-7xl h-screen flex flex-col">
        {/* Compact Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-2">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Application Modernization Assessment
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Evaluate your application's modernization level across key domains
          </p>
        </div>

        {/* Compact Overall Progress */}
        <OverallProgress
          categoryProgress={categoryProgress}
          totalQuestions={totalQuestions}
          answeredQuestions={answeredQuestions}
        />

        {/* Categories Grid - Fixed Height */}
        <div className="flex-1 min-h-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 h-full">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.name}
                category={category}
                completed={getCompletedCount(category.name)}
                onClick={() => handleCategoryClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Compact Submit Button */}
        <div className="text-center pt-3 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg ${
              allQuestionsAnswered
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Award className="w-4 h-4" />
            Get Assessment Results
          </button>
          
          {!allQuestionsAnswered && (
            <p className="text-gray-500 text-xs mt-1">
              Complete all categories ({answeredQuestions}/{totalQuestions} questions answered)
            </p>
          )}
        </div>

        {/* Category Dialog */}
        {selectedCategoryIndex !== null && (
          <CategoryDialog
            category={categories[selectedCategoryIndex]}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onClose={handleCloseDialog}
            onPrevious={handlePreviousCategory}
            onNext={handleNextCategory}
            hasPrevious={selectedCategoryIndex > 0}
            hasNext={selectedCategoryIndex < categories.length - 1}
            categoryIndex={selectedCategoryIndex}
            totalCategories={categories.length}
          />
        )}

        {/* Results Modal */}
        {showResults && assessmentResult && (
          <ResultsModal
            result={assessmentResult}
            onClose={() => setShowResults(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;