import React from 'react';
import { 
  Layers, 
  Rocket, 
  Zap, 
  Database, 
  Shield, 
  Smartphone, 
  Activity, 
  Code, 
  RefreshCw, 
  TrendingUp,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { Category } from '../types/assessment';

interface CategoryCardProps {
  category: Category;
  completed: number;
  onClick: () => void;
}

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case 'Architecture':
      return <Layers className="w-8 h-8" />;
    case 'Development & Deployment':
      return <Rocket className="w-8 h-8" />;
    case 'Scalability & Performance':
      return <Zap className="w-8 h-8" />;
    case 'Data & Storage':
      return <Database className="w-8 h-8" />;
    case 'Security & Compliance':
      return <Shield className="w-8 h-8" />;
    case 'User Experience':
      return <Smartphone className="w-8 h-8" />;
    case 'Observability & Monitoring':
      return <Activity className="w-8 h-8" />;
    case 'Technical Debt Management':
      return <Code className="w-8 h-8" />;
    case 'Backward Compatibility & Lifecycle':
      return <RefreshCw className="w-8 h-8" />;
    case 'Business Agility':
      return <TrendingUp className="w-8 h-8" />;
    default:
      return <Layers className="w-8 h-8" />;
  }
};

const getCategoryColor = (categoryName: string) => {
  switch (categoryName) {
    case 'Architecture':
      return 'from-blue-500 to-blue-600';
    case 'Development & Deployment':
      return 'from-green-500 to-green-600';
    case 'Scalability & Performance':
      return 'from-yellow-500 to-orange-500';
    case 'Data & Storage':
      return 'from-purple-500 to-purple-600';
    case 'Security & Compliance':
      return 'from-red-500 to-red-600';
    case 'User Experience':
      return 'from-pink-500 to-pink-600';
    case 'Observability & Monitoring':
      return 'from-indigo-500 to-indigo-600';
    case 'Technical Debt Management':
      return 'from-gray-500 to-gray-600';
    case 'Backward Compatibility & Lifecycle':
      return 'from-teal-500 to-teal-600';
    case 'Business Agility':
      return 'from-emerald-500 to-emerald-600';
    default:
      return 'from-blue-500 to-blue-600';
  }
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, completed, onClick }) => {
  const isCompleted = completed === category.questions.length;
  const progressPercentage = (completed / category.questions.length) * 100;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(category.name)} text-white`}>
          {getCategoryIcon(category.name)}
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
        {category.name}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4">
        {category.questions.length} questions in this category
      </p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-800">
            {completed}/{category.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${getCategoryColor(category.name)} transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};