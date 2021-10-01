var $navBar = document.querySelector('.nav-bar');

var $dataViews = document.querySelectorAll('.view');
var $recipeView = document.querySelector('.recipe');
var $favoritesView = document.querySelector('.favorites');

var $recipeName = document.querySelector('.title h1');
var $recipeSource = document.querySelector('.source a');
var $recipeImage = document.querySelector('.recipe-image img');
var $recipeIngredients = document.querySelector('.recipe-ingredients tbody');
var $recipeInstructions = document.querySelector('.recipe-instructions');

var $heartIcon = document.querySelector('.heart');

$navBar.addEventListener('click', function (event) {
  for (var i = 0; i < $dataViews.length; i++) {
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
      data.currentView = event.target.getAttribute('data-target');
    }
  }
});

$heartIcon.addEventListener('click', function (event) {
  loadFavorites();
  console.log('reload favs');
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

getRandomRecipe(); // Will change this so it displays the currentRecipe from data

function getRandomRecipe() {
  var recipe = new XMLHttpRequest();
  recipe.addEventListener('load', function (event) {
    var recipeJSON = JSON.parse(this.responseText);
    viewRecipe(recipeJSON);
    data.currentRecipe = recipeJSON.meals[0].idMeal;

  });
  recipe.open('GET', 'https://www.themealdb.com/api/json/v1/1/random.php');
  recipe.send();
}

function loadFavorites() {
  var $cardList = $favoritesView.querySelector('.card-list');
  clearCards($cardList);
  for (var i = data.favorites.length - 1; i > -1; i--) {
    var $recipeCard = document.createElement('div');
    $recipeCard.setAttribute('data-id', i);
    $cardList.appendChild($recipeCard);

    $recipeCard.addEventListener('click', function (event) {
      if (event.target.getAttribute('data-icon') === 'heart') {
        console.log(event.currentTarget);
        event.currentTarget.querySelector('.fa-heart').classList.remove('fas');
        event.currentTarget.querySelector('.fa-heart').classList.add('far');
      }
    });
    getRecipebyNumber(data.favorites[i], true, $recipeCard);

  }
}

function getRecipebyNumber(number, forFav, cardList) {
  var recipe = new XMLHttpRequest();
  recipe.addEventListener('load', function (event) {
    var recipeJSON = JSON.parse(this.responseText);
    if (forFav) {
      cardList.appendChild(createRecipeCard(recipeJSON.meals[0]));
    } else {
      return recipeJSON;
    }

  });
  recipe.open('GET', 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + number);
  recipe.send();

}

function viewRecipe(recipeJSON) {
  console.log(recipeJSON);

  if (data.favorites.includes(recipeJSON.meals[0].idMeal)) {
    $heartIcon.classList.remove('far');
    $heartIcon.classList.add('fas');
  } else {
    $heartIcon.classList.remove('fas');
    $heartIcon.classList.add('far');
  }
  for (var i = 0; i < $dataViews.length; i++) {
    $dataViews[i].classList.add('hidden');
  }
  $recipeView.classList.remove('hidden');

  $recipeName.textContent = recipeJSON.meals[0].strMeal;
  if (recipeJSON.meals[0].strSource) {
    $recipeSource.setAttribute('href', recipeJSON.meals[0].strSource);
  }
  $recipeImage.setAttribute('src', recipeJSON.meals[0].strMealThumb);
  for (var j = 1; j < 21; j++) {
    if (recipeJSON.meals[0]['strIngredient' + j]) {
      $recipeIngredients.appendChild(getIngredients(recipeJSON.meals[0]['strIngredient' + j], recipeJSON.meals[0]['strMeasure' + j]));
    }
  }
  var instructions = recipeJSON.meals[0].strInstructions.split('\n');
  for (var l = 0; l < instructions.length; l++) {
    var $recipeStep = document.createElement('p');
    $recipeStep.setAttribute('class', 'recipe-step');
    $recipeStep.textContent = instructions[l];
    $recipeInstructions.appendChild($recipeStep);
  }
}

function getIngredients(recipeIngredient, recipeAmount) {
  var $recipeRow = document.createElement('tr');
  var $recipeIngredient = document.createElement('td');
  var $recipeMeasure = document.createElement('td');

  $recipeIngredient.setAttribute('class', 'ingredient');
  $recipeMeasure.setAttribute('class', 'ingredient-amount');

  $recipeIngredient.textContent = recipeIngredient;
  $recipeMeasure.textContent = recipeAmount;

  $recipeRow.appendChild($recipeIngredient);
  $recipeRow.appendChild($recipeMeasure);

  return $recipeRow;

}

function createRecipeCard(recipeMeal) {
  var $recipeCard = document.createElement('div');
  var $recipeCardImage = document.createElement('img');
  var $recipeCardTitle = document.createElement('h3');
  var $recipeCardHeart = document.createElement('i');

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
