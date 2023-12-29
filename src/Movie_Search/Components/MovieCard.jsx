// MovieCard.js
import React from 'react';
import '../Components/MovieCard.css';
import { useState,useEffect } from 'react';
const MovieCard = ({ movie }) => {
    const [genres, setGenres] = useState([]);
    const [credits, setCredits] = useState([]);
  
    useEffect(() => {
      // Fetching movie genres
      const fetchGenres = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=2dca580c2a14b55200e784d157207b4d`);
          const data = await response.json();
          setGenres(data.genres);
        } catch (error) {
          console.error('Error fetching movie genres:', error);
        }
      };
  
      // Fetching movie credits (cast, crew)
      const fetchCredits = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=2dca580c2a14b55200e784d157207b4d`);
          const data = await response.json();
          setCredits(data.cast.slice(0, 3)); // Displaying only the first 3 cast members
        } catch (error) {
          console.error('Error fetching movie credits:', error);
        }
      };
  
      fetchGenres();
      fetchCredits();
    }, [movie.id]);
  
  return (
    <div className="movie-card">
         <h2 className="movie-title">{movie.title}</h2>
    <img className="movie-poster" src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`} alt={movie.title} />
    <div className="movie-details">
     
      <p className="movie-overview">{movie.overview}</p>
      <div className="movie-metadata">
        <p><strong>Genres:</strong> {genres.map((genre) => genre.name).join(', ')}</p>
        <p><strong>Director:</strong> {movie.director || 'Not available'}</p>
        <p><strong>Cast:</strong> {credits.map((actor) => actor.name).join(', ')}</p>
      </div>
    </div>
  </div>
  );
};

export default MovieCard;
