import { GoogleGenAI, Type } from "@google/genai";
import { MoviePreference, RecommendationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getMovieRecommendations(prefs: MoviePreference): Promise<RecommendationResponse> {
  const prompt = `
    You are an intelligent Movie Recommendation System.
    Based on the following user preferences, recommend at least 5 movies.
    
    User Preferences:
    - Genres: ${prefs.genres.join(", ")}
    - Favorite Movies: ${prefs.favoriteMovies.join(", ")}
    - Favorite Actors: ${prefs.actors.join(", ")}
    - Language: ${prefs.language}
    - Year Range: ${prefs.yearRange}
    - Mood: ${prefs.mood}

    Follow these steps:
    1. Analyze similarity based on genres, themes, actors, and tone.
    2. Provide a summary of the user's preferences.
    3. Recommend at least 5 movies that the user hasn't listed as favorites.
    
    Return the response in JSON format matching this schema:
    {
      "summary": {
        "genres": "string",
        "mood": "string",
        "favoriteMovies": "string",
        "language": "string",
        "yearRange": "string"
      },
      "recommendations": [
        {
          "title": "string",
          "year": "string",
          "genre": "string",
          "whyRecommended": "string",
          "similarTo": "string"
        }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.OBJECT,
            properties: {
              genres: { type: Type.STRING },
              mood: { type: Type.STRING },
              favoriteMovies: { type: Type.STRING },
              language: { type: Type.STRING },
              yearRange: { type: Type.STRING },
            },
            required: ["genres", "mood", "favoriteMovies", "language", "yearRange"],
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                year: { type: Type.STRING },
                genre: { type: Type.STRING },
                whyRecommended: { type: Type.STRING },
                similarTo: { type: Type.STRING },
              },
              required: ["title", "year", "genre", "whyRecommended", "similarTo"],
            },
          },
        },
        required: ["summary", "recommendations"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
