import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { NewsList } from './components/NewsList';
import { ViewSwitcher } from './components/ViewSwitcher';
import { NewsForm } from './components/NewsForm';
import { NewsArticle, ViewMode, Category } from './types';
import { DateFilter } from './components/DateFilter';
import { NewsDetailModal } from './components/NewsDetailModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ImportModal } from './components/ImportModal';

type DateFilterValue = 'all' | 'day' | 'week' | 'month';

export interface AnalyzedArticle {
  title: string;
  content: string;
  category: Category;
  keywords: string[];
}

const App: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const savedArticles = localStorage.getItem('news-archive');
      return savedArticles ? JSON.parse(savedArticles) : [];
    } catch (error) {
      console.error("Failed to parse articles from localStorage", error);
      return [];
    }
  });

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Temporal);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [articleToEdit, setArticleToEdit] = useState<NewsArticle | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('news-archive', JSON.stringify(articles));
    } catch (error) {
      console.error("Failed to save articles to localStorage", error);
    }
  }, [articles]);

  useEffect(() => {
    if (!searchTerm.trim() && viewMode === ViewMode.Relevance) {
      setViewMode(ViewMode.Temporal);
    }
  }, [searchTerm, viewMode]);

  const handleOpenAddForm = () => {
    setArticleToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (article: NewsArticle) => {
    setArticleToEdit(article);
    setSelectedArticle(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setArticleToEdit(null);
  };

  const handleSaveArticle = (articleData: Omit<NewsArticle, 'id' | 'createdAt'>) => {
    if (articleToEdit && 'id' in articleToEdit) { // Controlla se è un articolo completo da modificare
      const updatedArticle: NewsArticle = {
        ...articleToEdit,
        ...articleData,
      };
      setArticles(prev => prev.map(a => a.id === articleToEdit.id ? updatedArticle : a));
    } else { // Altrimenti è un nuovo articolo (o uno importato)
      const newArticle: NewsArticle = {
        ...articleData,
        id: new Date().getTime().toString(),
        createdAt: new Date().toISOString(),
      };
      setArticles(prevArticles => [newArticle, ...prevArticles]);
    }
    handleCloseForm();
  };

  const handleDeleteRequest = (articleId: string) => {
    setArticleToDelete(articleId);
  };

  const handleConfirmDelete = () => {
    if (articleToDelete) {
      setArticles(prevArticles => prevArticles.filter(a => a.id !== articleToDelete));
      setArticleToDelete(null);
      setSelectedArticle(null);
    }
  };

  const handleCancelDelete = () => {
    setArticleToDelete(null);
  };

  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };
  
  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };

  const handleArticleAnalyzed = (analyzedData: AnalyzedArticle) => {
    // Tratta i dati analizzati come un articolo da "modificare" per pre-compilare il form
    setArticleToEdit({
      ...analyzedData,
      // Aggiungi campi placeholder che l'utente dovrà compilare
      id: '', // ID vuoto perché non è ancora stato salvato
      articleDate: new Date().toISOString().split('T')[0],
      createdAt: '',
      link: ''
    });
    handleCloseImportModal();
    setIsFormOpen(true);
  };

  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (searchTerm.trim()) {
        const lowercasedTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(article =>
          article.title.toLowerCase().includes(lowercasedTerm) ||
          article.keywords.some(keyword => keyword.toLowerCase().includes(lowercasedTerm))
        );
    }
    
    if (dateFilter !== 'all') {
        const now = new Date();
        const cutoffDate = new Date();
        
        switch(dateFilter) {
            case 'day':
                cutoffDate.setDate(now.getDate() - 1);
                break;
            case 'week':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
        }

        filtered = filtered.filter(article => {
            const articleDate = new Date(article.articleDate);
            return articleDate >= cutoffDate && articleDate <= now;
        });
    }

    return filtered;
  }, [articles, searchTerm, dateFilter]);

  const articlesForDisplay = useMemo(() => {
    if (viewMode === ViewMode.Relevance && searchTerm.trim()) {
        const lowercasedTerm = searchTerm.toLowerCase();
        
        const getScore = (article: NewsArticle): number => {
            let score = 0;
            if (article.title.toLowerCase().includes(lowercasedTerm)) {
                score += 2;
            }
            score += article.keywords.filter(k => k.toLowerCase().includes(lowercasedTerm)).length;
            return score;
        };

        return [...filteredArticles].sort((a, b) => getScore(b) - getScore(a));
    }

    if (viewMode === ViewMode.Temporal) {
        return [...filteredArticles].sort((a, b) => new Date(b.articleDate).getTime() - new Date(a.articleDate).getTime());
    }
    
    return filteredArticles;
  }, [filteredArticles, viewMode, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header 
        onSearch={setSearchTerm} 
        onAddNews={handleOpenAddForm}
        onImportNews={handleOpenImportModal}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <ViewSwitcher 
            currentView={viewMode} 
            onViewChange={setViewMode}
            isSearchActive={!!searchTerm.trim()}
        />
        <DateFilter currentFilter={dateFilter} onFilterChange={setDateFilter} />
        <NewsList 
            articles={articlesForDisplay} 
            viewMode={viewMode}
            onArticleSelect={setSelectedArticle}
        />
      </main>
      {isFormOpen && (
        <NewsForm 
          onSave={handleSaveArticle} 
          onClose={handleCloseForm}
          articleToEdit={articleToEdit}
        />
      )}
      {selectedArticle && (
        <NewsDetailModal 
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            onDelete={handleDeleteRequest}
            onEdit={() => handleOpenEditForm(selectedArticle)}
        />
      )}
      {articleToDelete && (
        <ConfirmationModal
            title="Conferma Eliminazione"
            message="Sei sicuro di voler eliminare questa notizia? L'azione è irreversibile."
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
        />
      )}
      {isImportModalOpen && (
        <ImportModal 
            onClose={handleCloseImportModal}
            onArticleAnalyzed={handleArticleAnalyzed}
        />
      )}
    </div>
  );
};

export default App;