/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Film, 
  Sparkles, 
  Search, 
  Clapperboard, 
  Languages, 
  Calendar, 
  Smile, 
  ArrowRight,
  Loader2,
  ChevronLeft,
  Star,
  Plus,
  X
} from 'lucide-react';
import { cn } from './lib/utils';
import { MoviePreference, RecommendationResponse } from './types';
import { getMovieRecommendations } from './services/geminiService';

export default function App() {
  const [step, setStep] = useState<'input' | 'loading' | 'results'>('input');
  const [prefs, setPrefs] = useState<MoviePreference>({
    genres: [],
    favoriteMovies: [],
    actors: [],
    language: '',
    yearRange: '',
    mood: ''
  });
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form helpers
  const [tempGenre, setTempGenre] = useState('');
  const [tempMovie, setTempMovie] = useState('');
  const [tempActor, setTempActor] = useState('');

  const addGenre = () => {
    if (tempGenre && !prefs.genres.includes(tempGenre)) {
      setPrefs({ ...prefs, genres: [...prefs.genres, tempGenre] });
      setTempGenre('');
    }
  };

  const addMovie = () => {
    if (tempMovie && !prefs.favoriteMovies.includes(tempMovie)) {
      setPrefs({ ...prefs, favoriteMovies: [...prefs.favoriteMovies, tempMovie] });
      setTempMovie('');
    }
  };

  const addActor = () => {
    if (tempActor && !prefs.actors.includes(tempActor)) {
      setPrefs({ ...prefs, actors: [...prefs.actors, tempActor] });
      setTempActor('');
    }
  };

  const removeGenre = (g: string) => setPrefs({ ...prefs, genres: prefs.genres.filter(x => x !== g) });
  const removeMovie = (m: string) => setPrefs({ ...prefs, favoriteMovies: prefs.favoriteMovies.filter(x => x !== m) });
  const removeActor = (a: string) => setPrefs({ ...prefs, actors: prefs.actors.filter(x => x !== a) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prefs.genres.length === 0 && prefs.favoriteMovies.length === 0 && !prefs.mood) {
      setError("Please provide at least a genre, a favorite movie, or a mood.");
      return;
    }

    setError(null);
    setStep('loading');
    try {
      const data = await getMovieRecommendations(prefs);
      setResults(data);
      setStep('results');
    } catch (err) {
      console.error(err);
      setError("Failed to get recommendations. Please try again.");
      setStep('input');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep('input')}>
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">CineMatch AI</span>
          </div>
          {step === 'results' && (
            <button 
              onClick={() => setStep('input')}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              New Search
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-3">Find your next favorite film.</h1>
                <p className="text-zinc-500 text-lg">Tell us what you love, and our AI will curate a personalized list for you.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                {/* Genres */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    <Clapperboard className="w-4 h-4" />
                    Preferred Genres
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={tempGenre}
                      onChange={(e) => setTempGenre(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
                      placeholder="Action, Sci-Fi, Drama..."
                      className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={addGenre}
                      className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 transition-colors"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prefs.genres.map(g => (
                      <span key={g} className="px-3 py-1 bg-zinc-900 text-white text-sm rounded-full flex items-center gap-1">
                        {g}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeGenre(g)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Favorite Movies */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    <Star className="w-4 h-4" />
                    Favorite Movies
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={tempMovie}
                      onChange={(e) => setTempMovie(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMovie())}
                      placeholder="Inception, The Godfather..."
                      className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={addMovie}
                      className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 transition-colors"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prefs.favoriteMovies.map(m => (
                      <span key={m} className="px-3 py-1 bg-zinc-100 text-zinc-900 text-sm rounded-full flex items-center gap-1 border border-zinc-200">
                        {m}
                        <X className="w-3 h-3 cursor-pointer text-zinc-400 hover:text-zinc-900" onClick={() => removeMovie(m)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mood & Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                      <Smile className="w-4 h-4" />
                      Current Mood
                    </label>
                    <input 
                      type="text" 
                      value={prefs.mood}
                      onChange={(e) => setPrefs({...prefs, mood: e.target.value})}
                      placeholder="Funny, Dark, Inspiring..."
                      className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                      <Languages className="w-4 h-4" />
                      Language
                    </label>
                    <input 
                      type="text" 
                      value={prefs.language}
                      onChange={(e) => setPrefs({...prefs, language: e.target.value})}
                      placeholder="English, Korean, French..."
                      className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                    />
                  </div>
                </div>

                {/* Year Range & Actors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                      <Calendar className="w-4 h-4" />
                      Year Range
                    </label>
                    <input 
                      type="text" 
                      value={prefs.yearRange}
                      onChange={(e) => setPrefs({...prefs, yearRange: e.target.value})}
                      placeholder="90s, Recent, 2010-2020..."
                      className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                      <Search className="w-4 h-4" />
                      Favorite Actors
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={tempActor}
                        onChange={(e) => setTempActor(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addActor())}
                        placeholder="Leonardo DiCaprio..."
                        className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                      />
                      <button 
                        type="button"
                        onClick={addActor}
                        className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 transition-colors"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {prefs.actors.map(a => (
                        <span key={a} className="px-3 py-1 bg-zinc-100 text-zinc-900 text-sm rounded-full flex items-center gap-1 border border-zinc-200">
                          {a}
                          <X className="w-3 h-3 cursor-pointer text-zinc-400 hover:text-zinc-900" onClick={() => removeActor(a)} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                )}

                <button 
                  type="submit"
                  className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98]"
                >
                  Get Recommendations
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="relative mb-8">
                <Loader2 className="w-16 h-16 text-zinc-900 animate-spin" />
                <Sparkles className="w-6 h-6 text-zinc-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Analyzing your taste...</h2>
              <p className="text-zinc-500">Our AI is scanning thousands of films to find your perfect match.</p>
            </motion.div>
          )}

          {step === 'results' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Summary Section */}
              <section className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">User Preferences Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <SummaryItem label="Genres" value={results.summary.genres} />
                  <SummaryItem label="Mood" value={results.summary.mood} />
                  <SummaryItem label="Favorite Movies" value={results.summary.favoriteMovies} />
                  <SummaryItem label="Language" value={results.summary.language} />
                  <SummaryItem label="Year Range" value={results.summary.yearRange} />
                </div>
              </section>

              {/* Recommendations */}
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-tight">Top Recommendations</h2>
                  <span className="text-zinc-400 text-sm font-medium">{results.recommendations.length} curated picks</span>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {results.recommendations.map((movie, idx) => (
                    <motion.div 
                      key={movie.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:border-zinc-900 transition-all flex flex-col md:flex-row gap-8"
                    >
                      <div className="flex-shrink-0 w-full md:w-48 aspect-[2/3] bg-zinc-100 rounded-2xl overflow-hidden relative">
                        <img 
                          src={`https://picsum.photos/seed/${movie.title.replace(/\s+/g, '')}/400/600`}
                          alt={movie.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
                          {movie.year}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{movie.genre}</span>
                          <h4 className="text-2xl font-bold mt-1">{movie.title}</h4>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Why Recommended</p>
                          <p className="text-zinc-600 leading-relaxed">{movie.whyRecommended}</p>
                        </div>

                        <div className="pt-4 border-t border-zinc-100 flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Similar To:</span>
                          <span className="text-sm font-medium text-zinc-900 italic">{movie.similarTo}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => setStep('input')}
                  className="px-8 py-3 bg-zinc-900 text-white rounded-full font-semibold hover:bg-zinc-800 transition-all"
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-200 text-center">
        <p className="text-zinc-400 text-sm">Powered by Gemini AI • Crafted for Cinema Lovers</p>
      </footer>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{label}</p>
      <p className="text-sm font-medium text-zinc-900">{value || 'Not specified'}</p>
    </div>
  );
}
