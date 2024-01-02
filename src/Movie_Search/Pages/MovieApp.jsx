import React, { useState, useEffect, useRef } from 'react';
import MovieCard from '../Components/MovieCard';
import Navbar from '../Components/Navbar';
import '../Pages/MovieApp.css';

const MovieApp = () => {
  const [movies, setMovies] = useState([]);
  const [selectedGenreList, setSelectedGenreList] = useState([]);
  const [year, setYear] = useState(2012);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [scrollDir,setScrollDir] = useState('')
  const [page,setPage] = useState(1);
  const [searchQuery,setSearchQuery] = useState('')
  const prevYearRef = useRef(null);
  const debounceRef = useRef(null);

  const handleGenreSelection = (GenreList) => {
    setSelectedGenreList(GenreList);
  };

  const fetchMovies = async (changeName) => {
    try {
      let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&vote_count.gte=100&primary_release_year=${year}`;
      if (selectedGenreList.length > 0) {
        const genreQuery = selectedGenreList.join('|');
        apiUrl += `&with_genres=${genreQuery}`;
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (changeName === 'year') {
        if(scrollDir==='Down'){
        setMovies((prev) => [...prev, ...data.results]);
        }
        else{
          setMovies((prev) => [...data.results,...prev]);
        }
        setHasMoreMovies(data.results.length >= 20);
        if(year !== 2012){
        setTimeout(() => {
          window.scrollTo({
            top: window.scrollY + 600,
            behavior: 'smooth',
          });
        }, 50);}
      } else if (changeName === 'genre') {
        if (year !== 2012) {
          setYear(2012);
        }
        setMovies(data.results);
        setHasMoreMovies(data.results.length >= 20);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      // If the search query is empty, fetch default movies
      // setYear(2012);
      fetchMovies('year');
    }else{
    try {
      let apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=2dca580c2a14b55200e784d157207b4d&query=${searchQuery}&page=${page}`;
      
      if (selectedGenreList.length > 0) {
        const genreQuery = selectedGenreList.join('|');
        apiUrl += `&with_genres=${genreQuery}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();
      setMovies(data.results);
      if(searchQuery === ''){
        console.log("empty-search")
        fetchMovies('year')
      }
      console.log(data.results.length,apiUrl)
      setHasMoreMovies(data.results.length >= 20);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }
  };

  const handleInfiniteScroll = () => {
    if (debounceRef.current) return;
    debounceRef.current = setTimeout(() => {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
      if (
        document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.scrollHeight - 100 &&
        hasMoreMovies
      ) {
        if(searchQuery!==''){
          setPage((prevpage) => prevpage+1);
        }
        else{
        setScrollDir('Down')
        setYear((prevYear) => prevYear + 1);
        }
        setTimeout(() => {
          window.scrollTo({
            top: window.scrollY - 800,
          });
        }, 50);
      } else if (
        document.documentElement.scrollTop === 0 &&
        year > 1900
      ) {
        setScrollDir('Up')
        setYear((prevYear) => prevYear - 1);
      }
    }, 200);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleInfiniteScroll);
    return () => {
      window.removeEventListener('scroll', handleInfiniteScroll);
    };
  }, [hasMoreMovies, year,page]);

  useEffect(() => {
    fetchMovies('year');
  }, [year, selectedGenreList]);

  useEffect(() => {
    console.log(page)
    // if(searchQuery!==''){
      handleSearch(searchQuery);
    // }
  },[page]);

  return (
    <>
      <Navbar
        currYear={year}
        onGenreSelect={handleGenreSelection}
        onSearch={handleSearch}
        className='sticky-navbar'
      />
<div className="movie-app-container">
  {movies.map((movie, index) => (
    <React.Fragment key={`${movie.id}_${index}`}>
      {index !== 0 && movies[index - 1].release_year !== movie.release_year && (
        <h1 className="year-separator">  {movie.release_year} |</h1>
      )}
      <MovieCard key={`${movie.id}_${index}`} movie={movie} />
    </React.Fragment>
  ))}
</div>

    </>
  );
};

export default MovieApp;
