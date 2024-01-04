import React, { useState, useEffect, useRef } from 'react';
import MovieCard from '../Components/MovieCard';
import Navbar from '../Components/Navbar';
import Spinner from '../Components/Spinner';
import '../Pages/MovieApp.css';

const MovieApp = () => {
  const [movies, setMovies] = useState([]);
  const [selectedGenreList, setSelectedGenreList] = useState([]);
  const [year, setYear] = useState(2012);
  const [yearList, setYearList] = useState([2012, 2012]);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [scrollDir, setScrollDir] = useState('');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
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
        if (scrollDir === 'Down') {
          setMovies((prev) => [...prev, ...data.results]);
          setLoading(false);
        } else {
          setMovies((prev) => [...data.results, ...prev]);
          setLoading(false);
        }
        setHasMoreMovies(data.results.length >= 20);
      } else if (changeName === 'genre') {
        if (year !== 2012) {
          setYear(2012);
        }
        setMovies(data.results);
        setLoading(false);
        setHasMoreMovies(data.results.length >= 20);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim() && movies.length === 0 && year !== 2012) {
      fetchMovies('year');
    } else if (query !== '') {
      try {
        let apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&vote_count.gte=100&query=${query}&page=${page}`;
        if (selectedGenreList.length > 0) {
          const genreQuery = selectedGenreList.join('|');
          apiUrl += `&with_genres=${genreQuery}`;
        }
        const response = await fetch(apiUrl);
        const data = await response.json();
        setMovies(data.results);
        setLoading(false);
        if (searchQuery === '') {
          fetchMovies('year');
        }
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
          document.documentElement.scrollHeight - 50 &&
        hasMoreMovies
      ) {
        if (searchQuery !== '') {
          setLoading(true);
          setTimeout(() => {
            window.scrollTo({
              top: window.scrollY - 800,
            });
          }, 200);
          setPage((prevpage) => prevpage + 1);
        } else if (document.documentElement.scrollTop > 500) {
          setScrollDir('Down');
          setLoading(true);
          const minYear = [...yearList];
          minYear[1] += 1;
          setYearList(minYear);
          setYear(minYear[1]);
          setTimeout(() => {
            window.scrollTo({
              top: window.scrollY - 200,
            });
          }, 200);
        }
      } else if (
        searchQuery === '' &&
        document.documentElement.scrollTop === 0 &&
        yearList[0] > 1900
      ) {
        setScrollDir('Up');
        setLoading(true);
        const minYear = [...yearList];
        minYear[0] -= 1;
        setYearList(minYear);
        window.scrollTo({
          top: window.scrollY + 3000,
        });
        setYear(minYear[0]);
      }
    }, 200);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleInfiniteScroll);
    return () => {
      window.removeEventListener('scroll', handleInfiniteScroll);
    };
  }, [hasMoreMovies, year, page]);

  useEffect(() => {
    if (movies.length === 0) {
      window.scrollTo({
        top: 20,
      });
    }
  }, [movies]);

  useEffect(() => {
    fetchMovies('year');
    setInitialLoad(false);
  }, [year]);

  useEffect(() => {
    fetchMovies('genre');
  }, [selectedGenreList]);

  useEffect(() => {
    if (!searchQuery.trim() && !initialLoad) {
      setPage(1);
      fetchMovies('year');
      window.scrollTo({
        top: 20,
      });
    }
  }, [searchQuery]);

  return (
    <>
      <Navbar
        currYear={year}
        onGenreSelect={handleGenreSelection}
        onSearch={handleSearch}
        className='sticky-navbar'
      />
      <div>
        {loading && document.documentElement.scrollTop < 100 && (
          <div>
            <Spinner />
          </div>
        )}
        <div className="movie-app-container">
          {movies && movies.length > 1 && movies?.map((movie, index) => (
            <React.Fragment key={`${movie.id}_${index}`}>
              {index !== 0 && movies[index - 1].release_year !== movie.release_year && (
                <h1 className="year-separator"> {movie.release_year} |</h1>
              )}
              <MovieCard key={`${movie.id}_${index}`} movie={movie} />
            </React.Fragment>
          ))}
          {movies.length === 0 && (
            <h1 className="No-results" > No Results Found.</h1>
          )}
        </div>
        {loading && document.documentElement.scrollTop > 600 && (
          <div className='spinner-bottom'>
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
};

export default MovieApp;
