
import React from 'react';
import { NewsArticle } from '../types';

interface NewsItemProps {
  article: NewsArticle;
  onClick: () => void;
}

export const NewsItem: React.FC<NewsItemProps> = ({ article, onClick }) => {
  const formattedDate = new Date(article.articleDate).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <button onClick={onClick} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col text-left w-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold uppercase text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{article.category}</span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{article.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{article.content}</p>
      </div>
      {article.keywords.length > 0 && (
        <div className="px-6 pt-2 pb-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((keyword, index) => (
              <span key={index} className="text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded-md">
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </button>
  );
};
