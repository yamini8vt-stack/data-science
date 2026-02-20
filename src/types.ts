export interface MoviePreference {
  genres: string[];
  favoriteMovies: string[];
  actors: string[];
  language: string;
  yearRange: string;
  mood: string;
}

export interface Recommendation {
  title: string;
  year: string;
  genre: string;
  whyRecommended: string;
  similarTo: string;
}

export interface RecommendationResponse {
  summary: {
    genres: string;
    mood: string;
    favoriteMovies: string;
    language: string;
    yearRange: string;
  };
  recommendations: Recommendation[];
}
