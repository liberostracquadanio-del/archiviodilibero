
export enum Category {
  Politica = "Politica",
  Cronaca = "Cronaca",
  Esteri = "Esteri",
  Spettacolo = "Spettacolo",
  Sport = "Sport",
  Economia = "Economia",
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: Category;
  keywords: string[];
  articleDate: string; // Data dell'articolo definita dall'utente
  createdAt: string;   // ISO date string di quando è stato creato
  link?: string;
}

export enum ViewMode {
  Temporal = "Temporal",
  Category = "Category",
  Relevance = "Relevance",
}