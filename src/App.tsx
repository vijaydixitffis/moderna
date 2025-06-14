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
      <div className="container mx-auto px-4 py-8 max-w-7xl h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Application Modernization Assessment
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Evaluate your application's modernization level across key technology and business domains
          </p>
        </div>

        {/* Overall Progress */}
        <OverallProgress
          categoryProgress={categoryProgress}
          totalQuestions={totalQuestions}
          answeredQuestions={answeredQuestions}
        />

        {/* Categories Grid */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full overflow-y-auto pb-6">
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

        {/* Submit Button */}
        <div className="text-center pt-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg ${
              allQuestionsAnswered
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Award className="w-5 h-5" />
            Get Assessment Results
          </button>
          
          {!allQuestionsAnswered && (
            <p className="text-gray-500 text-sm mt-2">
              Complete all categories to view your results ({answeredQuestions}/{totalQuestions} questions answered)
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