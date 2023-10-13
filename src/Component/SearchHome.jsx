import React, { useState } from "react";
import axios from "axios";

function SearchHome() {
  const [currentInput, setCurrentInput] = useState("");
  const [currentResult, setCurrentResult] = useState(null);
  const [favorites, setFavorites] = useState([]); // State to store favorite movies

  const submitAndSearch = () => {
    const omdbUrl = "https://www.omdbapi.com/";
    const apiKey = "d7ee544f";
    const imdbId = "tt3896198";
    const movieTitle = currentInput || "krrish";

    axios
      .get(omdbUrl, {
        params: {
          i: imdbId,
          apikey: apiKey,
          t: movieTitle,
        },
      })
      .then((response) => {
        setCurrentResult(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setCurrentResult(null);
      });
  };

  const addToFavorites = async () => {
    if (currentResult) {
        setFavorites([...favorites, currentResult]);
      try {
        const response = await axios.post('http://localhost:3001/mark-as-favorite', {
          movieId: currentResult.imdbID,
        });
  
        if (response.status === 200) {
          console.log('success saving the movie as a favorite');
        } else {
          console.error('Error saving the movie as a favorite');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  

  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a movie title"
          aria-label="Enter a movie title"
          aria-describedby="basic-addon2"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
        />
        <span className="input-group-text" id="basic-addon2">
          <button onClick={submitAndSearch}>Search</button>
        </span>
      </div>

      {currentResult && (
        <div className="card mb-3" style={{ maxWidth: "540px" }}>
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={currentResult.Poster}
                className="img-fluid rounded-start"
                alt={currentResult.Title}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{currentResult.Title}</h5>
                <p className="card-text">{currentResult.Plot}</p>
                <p className="card-text">
                  <small className="text-body-secondary">{`Released: ${currentResult.Year}`}</small>
                </p>
                <button onClick={addToFavorites}>Add to Favorites</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2>Favorites</h2>
        <ul>
          {favorites.map((favorite, index) => (
            <li key={index}>{favorite.Title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchHome;
