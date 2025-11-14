import React, { useState } from 'react';
import { AnalyzedArticle } from '../App';
import { CloseIcon } from './icons';

interface ImportModalProps {
  onClose: () => void;
  onArticleAnalyzed: (data: AnalyzedArticle) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose, onArticleAnalyzed }) => {
  const [articleUrl, setArticleUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!articleUrl.trim() || !/^https?:\/\//.test(articleUrl)) {
      setError('Per favore, inserisci un link valido (deve iniziare con http:// o https://).');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: articleUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Errore del server: ${response.statusText}`);
      }

      const analyzedData: AnalyzedArticle = await response.json();
      onArticleAnalyzed(analyzedData);
      onClose();

    } catch (err) {
      console.error("Errore durante l'analisi del link:", err);
      setError(err instanceof Error ? err.message : 'Si è verificato un errore sconosciuto. Assicurati che il link porti a un articolo di notizie standard.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Importa Notizia da Link</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Chiudi"
            >
              <CloseIcon />
            </button>
          </div>
          
          {error && <p className="text-red-700 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
          
          <p className="text-gray-600 mb-4">
            Incolla il link a un articolo di notizie. Il sistema estrarrà il testo e userà l'IA per compilare automaticamente i campi della notizia.
          </p>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="article-url" className="block text-sm font-medium text-gray-700 mb-1">Link dell'articolo</label>
              <input
                id="article-url"
                type="url"
                value={articleUrl}
                onChange={(e) => setArticleUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://www.esempio.it/notizia/..."
                disabled={isLoading}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading || !articleUrl.trim()}
                className="bg-green-600 text-white font-bold py-2 px-6 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analisi in corso...</span>
                  </>
                ) : 'Analizza Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
