'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';

// On type la réponse de notre API
interface ApiResponse {
  result?: string;
  error?: string;
}

export default function Home() {
  // Typage explicite des states
  const [input, setInput] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');
    setError('');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      if (data.result) {
        setResponse(data.result);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur de connexion");
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">POC Gemini & TypeScript</h1>
        
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Posez votre question..."
            className="w-full p-4 border rounded-lg text-black min-h-[100px]"
            disabled={loading}
          />
          
          <button 
            type="submit"
            disabled={loading || !input}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Génération en cours...' : 'Envoyer à Gemini'}
          </button>
        </form>

        {error && (
          <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg w-full max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {response && (
          <div className="mt-8 p-6 bg-gray-100 rounded-lg w-full max-w-2xl mx-auto border border-gray-300">
            <h3 className="font-bold mb-2 text-black">Réponse :</h3>
            <div className="whitespace-pre-wrap text-gray-800">
              {response}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}