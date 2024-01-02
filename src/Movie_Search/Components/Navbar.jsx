import React, { useState, useEffect } from 'react';
import '../Components/Navbar.css'; // Assuming you have a CSS file for styling


const Navbar = ({ onGenreSelect,currYear,onSearch }) => {
  const [genres, setGenres] = useState([]);
  const [genreNameList,setGenreNameList] = useState(['all'])
  const handleSearch = (event) => {
    const query = event.target.value;
    onSearch(query);
  }
  useEffect(() => {
    fetchGenreList();
  }, []);
  useEffect(()=>{
  },[genreNameList])

  const fetchGenreList = async () => {
    try {
      const response = await fetch(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=2dca580c2a14b55200e784d157207b4d'
      );
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Error fetching genre list:', error);
    }
  };

  const handleGenreClick = (genreId) => {
    // Pass the selected genre ID to the parent component (MovieApp)
    
    genreId = !genreId?'all':genreId;
    let genreNameListCopy = [...genreNameList]
    if(genreNameListCopy.indexOf(genreId)!==-1){
      if(genreId!=='all' || genreNameList.length>1){
      genreNameListCopy.splice(genreNameListCopy.indexOf(genreId),1)
      }
    }
    else{
      genreNameListCopy.push(genreId)
    }
    if(genreNameListCopy.length === 0){
      genreNameListCopy.push('all');
    }
    if(genreNameListCopy.length>1 && genreNameListCopy.indexOf('all')!==-1){
      genreNameListCopy.splice(genreNameListCopy.indexOf('all'),1);
    }
    setGenreNameList(genreNameListCopy)
    onGenreSelect(genreNameListCopy);
  };

  return (
    <div className='main-navbar'>
      <div style={{display:'flex',alignItems:'center',marginRight:'3%',height:'65px',width: '-webkit-fill-available'}}>
      <div className='header'>MOVIEFIX</div>
     
      {/* <h2 style={{margin:'auto'}}>Displaying for year : {currYear}</h2> */}
      <input  type="text" placeholder="Search movies..." onChange={handleSearch} style={{marginLeft:'auto'}}/>
      </div>
      <div className='genres'>
        <ul className='genretabs'>
          {/* Render "All" button */}
          <li>
            <button onClick={() => handleGenreClick('all')} className={genreNameList.includes('all')?'-active':''}>All</button>
          </li>
          {/* Render genre buttons */}
          {genres.map((genre) => (
            <li key={genre.id}>
              <button onClick={() => handleGenreClick(genre.id)} className={genreNameList.includes(genre.id)?'-active':''}>
                {genre.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
