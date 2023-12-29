import React, { useState, useEffect } from 'react';
import MovieCard from '../Components/MovieCard';
import Navbar from '../Components/Navbar';
import '../Pages/MovieApp.css';

const MovieApp = () => {
  const [movies, setMovies] = useState([]);
  const [selectedGenreList, setSelectedGenreList] = useState([]);
  const [year, setYear] = useState(2012);

  const handleGenreSelection = (GenreList) => {
    setSelectedGenreList(GenreList);
  };

  const fetchMovies = async () => {
    try {
      let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&vote_count.gte=100&primary_release_year=${year}`;
      if (selectedGenreList.length > 0) {
        const genreQuery = selectedGenreList.join('|');
        apiUrl += `&with_genres=${genreQuery}`;
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data.results.length)
      setMovies((prev) => [...prev, ...data.results]);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 2 >=
      document.documentElement.scrollHeight
    ) {
      setYear((prevyear) => prevyear + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleInfiniteScroll);
    return () => {
      window.removeEventListener('scroll', handleInfiniteScroll);
    };
  }, []);


  useEffect(() => {
    fetchMovies();
  }, [year, selectedGenreList]);

  return (
    <>
      <Navbar onGenreSelect={handleGenreSelection} />
      <div className="movie-container">
        <div className="movie-app-container">
          {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MovieApp;
