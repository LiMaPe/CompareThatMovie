//use the axios library to make XLMHttpRequests. (to make network request alternative is ex fetch)

const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === "N/A" ? "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101065/112815953-stock-vector-no-image-available-icon-flat-vector.jpg?ver=6" : movie.Poster;
        return `
      <img src="${imgSrc}" />
      ${movie.Title} 
    `;
    },

    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: "9b56fbb0",
                s: searchTerm
            }
        });
            if(response.data.Error) {
                return [];
        };
            return response.data.Search;
    }
};

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    },
});

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    },
});


let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "9b56fbb0",
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === "left") {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    };

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    let leftSideStats = document.querySelectorAll(
      '#left-summary .notification'
    );
    let rightSideStats = document.querySelectorAll(
      '#right-summary .notification'
    );
  
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
    
        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);
    
        console.log(leftSideValue);
        console.log(rightSideValue);

        if(leftSideValue == 0 || rightSideValue == 0) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-info');
            rightStat.classList.remove('is-primary');
          rightStat.classList.add('is-info');
        } else if (rightSideValue > leftSideValue) {
          leftStat.classList.remove('is-primary');
          leftStat.classList.add('is-warning');
        } else {
          rightStat.classList.remove('is-primary');
          rightStat.classList.add('is-warning');
        }
      });
    };

//helper function to make HTML for the movie template
const movieTemplate = movieDetail => {
    let dollars = parseInt(
      movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
    ) || 0;
    let metascore = parseInt(movieDetail.Metascore) || 0;
    let imdbRating = parseFloat(movieDetail.imdbRating) || 0;
    let imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    let awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
      let value = parseInt(word);
  
      if (isNaN(value)) {
        return prev;
      } else {
        return prev + value;
      }
    }, 0);
    
    return `
      <article class="media">
        <figure class="media-left">
          <p class="image">
            <img src="${movieDetail.Poster}" />
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <h1>${movieDetail.Title}</h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
          </div>
        </div>
      </article>
  
      <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
      </article>
      <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
      </article>
      <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
      </article>
      <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
      </article>
      <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
      </article>
    `;
  };