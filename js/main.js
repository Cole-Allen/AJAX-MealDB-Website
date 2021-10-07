const $navBar = document.querySelector('.nav-bar');

const $dataViews = document.querySelectorAll('.view');
const $recipeView = document.querySelector('.recipe');
const $favoritesView = document.querySelector('.favorites');

const $recipeName = document.querySelector('.title h1');
const $recipeSource = document.querySelector('.source a');
const $recipeImage = document.querySelector('.recipe-image img');
const $recipeIngredients = document.querySelector('.recipe-ingredients tbody');
const $recipeInstructions = document.querySelector('.recipe-instructions');

const $heartIcon = document.querySelector('.heart');

const $searchForm = document.forms['search-form'];
const $searchBar = $searchForm['search-bar'];
const $searchButton = $searchForm['search-button'];

$searchButton.addEventListener('click', function (event) {
  event.preventDefault();
  getRecipebyName($searchBar.value);
  $searchForm.reset();
});

$navBar.addEventListener('click', function (event) {
  for (let i = 0; i < $dataViews.length; i++) {
    $recipeView.classList.add('hidden');
    $dataViews[i].classList.add('hidden');
    if (event.target.getAttribute('data-target') === $dataViews[i].getAttribute('data-view')) {
      $dataViews[i].classList.remove('hidden');

      if ($dataViews[i].getAttribute('data-view') === 'favorites') {
        loadFavorites();
      }
      data.currentView = $dataViews[i].getAttribute('data-view');

    } else if (event.target.getAttribute('data-target') === 'random') {
      getRandomRecipe();
      data.currentView = 'recipe';
      return;
    }
  }
});

$heartIcon.addEventListener('click', function (event) {
  loadFavorites();
  if (!data.favorites.includes(data.currentRecipe)) {
    data.favorites.push(data.currentRecipe);
    $heartIcon.classList.remove('far');
    $heartIcon.classList.add('fas');
  } else {
    data.favorites.splice(data.favorites.indexOf(data.currentRecipe), 1);
    $heartIcon.classList.remove('fas');
    $heartIcon.classList.add('far');
  }

});

switchViews(data.currentView); // Will change this so it displays the currentRecipe from data

function getRandomRecipe() {
  const recipe = new XMLHttpRequest();
  recipe.addEventListener('load', function (event) {
    const recipeJSON = JSON.parse(this.responseText);
    viewRecipe(recipeJSON);
    data.currentRecipe = recipeJSON.meals[0].idMeal;

  });
  recipe.open('GET', 'https://www.themealdb.com/api/json/v1/1/random.php');
  recipe.send();
}

function loadFavorites() {
  const $cardList = $favoritesView.querySelector('.card-list');
  clearCards($cardList);
  for (let i = data.favorites.length - 1; i > -1; i--) {
    const $recipeCard = document.createElement('div');
    $recipeCard.setAttribute('data-id', data.favorites[i]);
    $cardList.appendChild($recipeCard);

    $recipeCard.addEventListener('click', function (event) {
      const indexOf = data.favorites.indexOf(event.currentTarget.getAttribute('data-id'));
      if (event.target.getAttribute('data-icon') === 'heart') {
        if (data.favorites.includes(event.currentTarget.getAttribute('data-id'))) {
          data.favorites.splice(indexOf, 1);
        } else {
          data.favorites.push(event.currentTarget.getAttribute('data-id'));
        }
        event.currentTarget.querySelector('.fa-heart').classList.toggle('fas');
        event.currentTarget.querySelector('.fa-heart').classList.toggle('far');
      }
    });
    getRecipebyNumber(data.favorites[i], true, $recipeCard);

  }
}

function getRecipebyNumber(number, forFav, cardList) {
  const recipe = new XMLHttpRequest();
  recipe.addEventListener('load', function (event) {
    const recipeJSON = JSON.parse(this.responseText);
    if (forFav) {
      cardList.appendChild(createRecipeCard(recipeJSON.meals[0]));
    } else {
      return recipeJSON;
    }

  });
  recipe.open('GET', 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + number);
  recipe.send();

}

function getRecipebyName(name) {
  const recipe = new XMLHttpRequest();
  recipe.addEventListener('load', function (event) {
    const recipeJSON = JSON.parse(this.responseText);
    console.log(recipeJSON);
    if (recipeJSON.meals && recipeJSON.meals.length > 1) {
      console.log('multiple found');
    } else if (recipeJSON.meals && recipeJSON.meals.length === 1) {
      console.log('one found');
    } else {
      console.log('none found');
    }

  });
  recipe.open('GET', 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + name);
  recipe.send();
}

function viewRecipe(recipeJSON) {

  if (data.favorites.includes(recipeJSON.meals[0].idMeal)) {
    $heartIcon.classList.remove('far');
    $heartIcon.classList.add('fas');
  } else {
    $heartIcon.classList.remove('fas');
    $heartIcon.classList.add('far');
  }
  for (let i = 0; i < $dataViews.length; i++) {
    $dataViews[i].classList.add('hidden');
  }
  $recipeView.classList.remove('hidden');

  $recipeName.textContent = recipeJSON.meals[0].strMeal;
  if (recipeJSON.meals[0].strSource) {
    $recipeSource.setAttribute('href', recipeJSON.meals[0].strSource);
  }
  $recipeImage.setAttribute('src', recipeJSON.meals[0].strMealThumb);
  while ($recipeIngredients.firstChild) {
    $recipeIngredients.removeChild($recipeIngredients.firstChild);
  }
  for (let j = 1; j < 21; j++) {

    if (recipeJSON.meals[0]['strIngredient' + j]) {
      $recipeIngredients.appendChild(getIngredients(recipeJSON.meals[0]['strIngredient' + j], recipeJSON.meals[0]['strMeasure' + j]));
    }
  }
  const instructions = recipeJSON.meals[0].strInstructions.split('\n');
  for (let l = 0; l < instructions.length; l++) {
    const $recipeStep = document.createElement('p');
    $recipeStep.setAttribute('class', 'recipe-step');
    $recipeStep.textContent = instructions[l];
    $recipeInstructions.appendChild($recipeStep);
  }
}

function getIngredients(recipeIngredient, recipeAmount) {
  const $recipeRow = document.createElement('tr');
  const $recipeIngredient = document.createElement('td');
  const $recipeMeasure = document.createElement('td');

  $recipeIngredient.setAttribute('class', 'ingredient');
  $recipeMeasure.setAttribute('class', 'ingredient-amount');

  $recipeIngredient.textContent = recipeIngredient;
  $recipeMeasure.textContent = recipeAmount;

  $recipeRow.appendChild($recipeIngredient);
  $recipeRow.appendChild($recipeMeasure);

  return $recipeRow;

}

function createRecipeCard(recipeMeal) {
  const $recipeCard = document.createElement('div');
  const $recipeCardImage = document.createElement('img');
  const $recipeCardTitle = document.createElement('h3');
  const $recipeCardHeart = document.createElement('i');

  $recipeCard.setAttribute('class', 'recipe-card row');
  $recipeCardImage.setAttribute('src', recipeMeal.strMealThumb);
  $recipeCardHeart.setAttribute('class', 'fas fa-heart');
  $recipeCardHeart.setAttribute('data-icon', 'heart');
  $recipeCardTitle.textContent = recipeMeal.strMeal;

  $recipeCard.appendChild($recipeCardImage);
  $recipeCard.appendChild($recipeCardTitle);
  $recipeCard.appendChild($recipeCardHeart);

  return $recipeCard;
}

function clearCards(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

function switchViews(view) {
  for (let i = 0; i < $dataViews.length; i++) {
    console.log($dataViews[i]);
    $dataViews[i].classList.add('hidden');
  }
}
