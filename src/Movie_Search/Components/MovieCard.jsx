import React, { useState, useEffect } from 'react';
import '../Components/MovieCard.css';

const MovieCard = ({ movie }) => {
  const [genres, setGenres] = useState([]);
  const [credits, setCredits] = useState([]);
  const [director, setDirector] = useState([]);
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const genreResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=2dca580c2a14b55200e784d157207b4d`);
        const genreData = await genreResponse.json();
        setGenres(genreData.genres);

        const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=2dca580c2a14b55200e784d157207b4d`);
        const creditsData = await creditsResponse.json();
        setCredits(creditsData?.cast?.slice(0, 3)); 
        setDirector(creditsData?.crew.filter(x => x.known_for_department === 'Directing')[0])
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieData();
  }, [movie.id]);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/200x300'; 
    e.target.onerror = null; 
  };

  return (
    <div className="movie-card">
      <div className="rating-circle">{movie.vote_average.toFixed(1)}</div>
      <img className="movie-poster" src={movie.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : 'https://via.placeholder.com/200x300'} onError={handleImageError} alt={movie.title} />
      <h2 className="movie-title">{movie.title}</h2>
      <div className="movie-details">
        <p className="movie-overview" >{movie.overview}</p>
        <div className="movie-metadata">
        <p><strong>Release Year:</strong> {movie.release_date ? movie.release_date.substring(0, 4) : 'Not available'}</p>
          <p><strong>Genres:</strong> {genres.map((genre) => genre.name).join(', ')}</p>
          <p><strong>Director:</strong> {director?.name?director.name:'not available'} </p>
          {credits.length > 0 && (
            <p><strong>Cast:</strong> {credits.map((actor) => actor.name).join(', ')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
