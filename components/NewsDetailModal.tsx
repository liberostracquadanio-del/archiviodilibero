import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import { CloseIcon, LinkIcon, TrashIcon, PencilIcon } from './icons';

interface NewsDetailModalProps {
  article: NewsArticle;
  onClose: () => void;
  onDelete: (articleId: string) => void;
  onEdit: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose, onDelete, onEdit }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    // Attiva la transizione di "ingresso" dopo che il componente è stato montato
    const id = requestAnimationFrame(() => {
      setIsShowing(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setIsShowing(false);
    // Attendi la fine dell'animazione di "uscita" prima di chiamare onClose del genitore
    setTimeout(onClose, 300); // Questa durata dovrebbe corrispondere alla durata della transizione
  };

  const formattedDate = new Date(article.articleDate).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-center p-4" 
      onClick={handleClose} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="news-title"
    >
      {/* Sfondo */}
      <div className={`fixed inset-0 bg-gray-900 transition-opacity duration-300 ${isShowing ? 'bg-opacity-75' : 'bg-opacity-0'}`}></div>
      
      {/* Pannello Modale */}
      <div 
        className={`bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out ${isShowing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 pr-4">
              <span className="text-sm font-semibold uppercase text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{article.category}</span>
              <h2 id="news-title" className="text-2xl sm:text-3xl font-bold text-gray-800 mt-3">{article.title}</h2>
              <p className="text-md text-gray-500 mt-1">{formattedDate}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Chiudi"
            >
              <CloseIcon />
            </button>
          </div>
          
          <div className="prose prose-indigo max-w-none mt-6 text-gray-700" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {article.content}
          </div>

          <div className="mt-8 border-t pt-6">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-6">
                <div className="space-y-4 flex-grow">
                    {article.keywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                         <h4 className="text-sm font-semibold text-gray-600 mr-2">Parole chiave:</h4>
                        {article.keywords.map((keyword, index) => (
                          <span key={index} className="text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded-md">
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    )}

                    {article.link && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        <a 
                          href={article.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 hover:underline break-all"
                        >
                          {article.link}
                        </a>
                      </div>
                    )}
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={onEdit}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md py-2 px-3 transition-colors bg-indigo-50 hover:bg-indigo-100"
                            aria-label="Modifica notizia"
                        >
                            <PencilIcon className="h-5 w-5" />
                            <span>Modifica Notizia</span>
                        </button>
                        <button
                            onClick={() => onDelete(article.id)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md py-2 px-3 transition-colors bg-red-50 hover:bg-red-100"
                            aria-label="Elimina notizia"
                        >
                            <TrashIcon className="h-5 w-5" />
                            <span>Elimina Notizia</span>
                        </button>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};