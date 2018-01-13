(function() {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  function addImage(data) {
    let htmlContent = '';
    const firstImg = data.results[0];
    if (firstImg) {
      htmlContent = `<figure>
          <img src="${firstImg.urls.regular}" alt="searchedForText"/>
          <figcaption>${searchedForText} by ${firstImg.user.name}</figcaption>
          </figure>`;
    } else {
      htmlContent = '<div class="error-no-image ">no images available</div>';
    }

    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
  }

  function addArticles(data) {
    let content = '';
    if (data.response && data.response.docs && data.response.docs.length > 1) {
      content =
        '<ul>' +
        data.response.docs
          .map(
            article => `<li class='article'>
         <h2><a href='${article.web_url}'>${article.headline.main}</a></h2>
         <p>${article.snippet}</p></li>`
          )
          .join('') +
        '</ul>';
    } else {
      content = '<div class="error-no-articles">No Articles Available</div>';
    }
    responseContainer.insertAdjacentHTML('beforeend', content);
  }
  function requestError(e, part) {
    console.log(e);
    responseContainer.insertAdjacentHTML(
      'beforeend',
      `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`
    );
  }
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;

    //send image request to unsplash

    fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
      {
        headers: {
          Authorization:
            'Client-ID 07121df6216a56d28888c1ea836f6f18acbdb658be11e3718546d97da03e4a99'
        }
      }
    )
      .then(response => response.json())
      .then(addImage)
      .catch(e => requestError(e, 'image'));

    fetch(
      `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=10cbb059af054687af59a32196fe6008`
    )
      .then(response => response.json())
      .then(addArticles)
      .catch(e => requestError(e, 'articles'));
  });
})();
