import React, { useState, useEffect } from 'react';
import { NewsArticle, Category } from '../types';
import { CATEGORIES } from '../constants';
import { CloseIcon } from './icons';

interface NewsFormProps {
  onSave: (article: Omit<NewsArticle, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  articleToEdit?: NewsArticle | null;
}

export const NewsForm: React.FC<NewsFormProps> = ({ onSave, onClose, articleToEdit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [keywords, setKeywords] = useState('');
  const [articleDate, setArticleDate] = useState(new Date().toISOString().split('T')[0]); // Formato YYYY-MM-DD
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const isEditing = !!articleToEdit;

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setContent(articleToEdit.content);
      setCategory(articleToEdit.category);
      setKeywords(articleToEdit.keywords.join(', '));
      setArticleDate(articleToEdit.articleDate);
      setLink(articleToEdit.link || '');
    }
  }, [articleToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Titolo e testo della notizia sono obbligatori.');
      return;
    }
    setError('');
    
    const keywordsArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
    
    onSave({
      title,
      content,
      category,
      keywords: keywordsArray,
      articleDate,
      link,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Modifica Notizia' : 'Aggiungi Nuova Notizia'}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                    aria-label="Chiudi"
                >
                    <CloseIcon />
                </button>
            </div>
          
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="articleDate" className="block text-sm font-medium text-gray-700 mb-1">Data Notizia</label>
                    <input
                        type="date"
                        id="articleDate"
                        value={articleDate}
                        onChange={(e) => setArticleDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Testo Notizia</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">Parole Chiave (separate da virgola)</label>
                    <input
                        type="text"
                        id="keywords"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Es: politica, elezioni, governo"
                    />
                </div>

                 <div>
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Link (opzionale)</label>
                    <input
                        type="url"
                        id="link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://esempio.com/articolo"
                    />
                </div>
                
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                    >
                        {isEditing ? 'Salva Modifiche' : 'Salva'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};