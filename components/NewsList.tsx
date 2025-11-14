
import React from 'react';
import { NewsArticle, ViewMode, Category } from '../types';
import { NewsItem } from './NewsItem';
import { CATEGORIES } from '../constants';

interface NewsListProps {
  articles: NewsArticle[];
  viewMode: ViewMode;
  onArticleSelect: (article: NewsArticle) => void;
}

export const NewsList: React.FC<NewsListProps> = ({ articles, viewMode, onArticleSelect }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Nessuna notizia trovata. Inizia ad aggiungere qualcosa all'archivio o modifica i filtri!</p>
      </div>
    );
  }

  if (viewMode === ViewMode.Temporal || viewMode === ViewMode.Relevance) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <NewsItem key={article.id} article={article} onClick={() => onArticleSelect(article)} />
        ))}
      </div>
    );
  }

  if (viewMode === ViewMode.Category) {
    const groupedArticles = articles.reduce((acc, article) => {
      (acc[article.category] = acc[article.category] || []).push(article);
      return acc;
    }, {} as Record<Category, NewsArticle[]>);

    return (
      <div className="space-y-12">
        {CATEGORIES.map(category => {
          const categoryArticles = groupedArticles[category];
          if (!categoryArticles || categoryArticles.length === 0) {
            return null;
          }
          return (
            <section key={category}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-500">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryArticles.sort((a,b) => new Date(b.articleDate).getTime() - new Date(a.articleDate).getTime()).map(article => (
                  <NewsItem key={article.id} article={article} onClick={() => onArticleSelect(article)} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  return null;
};