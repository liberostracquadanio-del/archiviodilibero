// Questo file dovrebbe essere deployato come una Serverless Function
// su una piattaforma come Vercel o Google Cloud Functions.
// Non può essere eseguito direttamente nel browser.

// Per eseguirlo, avrai bisogno di installare queste dipendenze nel tuo progetto backend:
// npm install @google/genai cheerio

import { GoogleGenAI, Type } from "@google/genai";

// Funzione 'cheerio' fittizia per l'ambiente di sviluppo locale.
// In un ambiente server reale, dovresti importare 'cheerio'.
// import * as cheerio from 'cheerio';
declare function load(html: string): any;

// Simula la risposta di una funzione serverless (es. in Vercel)
interface ServerlessResponse {
  status: (code: number) => { json: (data: any) => void };
}

// Handler principale della nostra API
export default async function handler(req: { method: string; body: { url: string } }, res: ServerlessResponse) {
  // Gestione CORS per permettere al frontend di chiamare questa API
  // In un ambiente reale, questi header andrebbero impostati nella configurazione del server/piattaforma
  /*
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // O un'origine specifica
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, ...');
  */

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { url } = req.body;

  if (!url || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'URL non valido fornito' });
  }

  try {
    // --- 1. Web Scraping: Estrazione del testo dalla pagina ---
    // In un ambiente server Node.js, useresti 'node-fetch' o 'axios'
    const pageResponse = await fetch(url);
    if (!pageResponse.ok) {
      throw new Error(`Impossibile raggiungere la pagina. Status: ${pageResponse.status}`);
    }
    const html = await pageResponse.text();
    
    // Utilizzo di una libreria come 'cheerio' per parsare l'HTML
    // const $ = cheerio.load(html);
    // const articleText = $('article p').text() || $('main p').text() || $('p').text();
    
    // Dato che non possiamo usare cheerio qui, simuliamo l'estrazione
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const paragraphs = Array.from(tempDiv.querySelectorAll('p')).map(p => p.textContent);
    const articleText = paragraphs.join('\n\n').trim();

    if (!articleText) {
      throw new Error("Impossibile estrarre un testo significativo dall'articolo. La struttura della pagina potrebbe essere non standard.");
    }
    
    // --- 2. Analisi AI con Gemini ---
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Analizza il seguente testo di un articolo di giornale e restituisci un oggetto JSON con le seguenti chiavi: "title" (stringa), "content" (stringa, un riassunto di 3-4 frasi), "category" (una tra "Politica", "Cronaca", "Esteri", "Spettacolo", "Sport", "Economia"), e "keywords" (un array di 3-5 parole chiave stringa rilevanti). Ecco il testo:\n\n---\n\n${articleText.substring(0, 15000)}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING, enum: ["Politica", "Cronaca", "Esteri", "Spettacolo", "Sport", "Economia"] },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["title", "content", "category", "keywords"],
          },
        },
    });
    
    const analyzedData = JSON.parse(response.text);
    
    // --- 3. Restituzione dei dati al Frontend ---
    return res.status(200).json(analyzedData);

  } catch (error) {
    console.error('Errore nella funzione API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto del server';
    return res.status(500).json({ error: errorMessage });
  }
}
