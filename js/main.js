var $recipeName = document.querySelector('.title h1');
var $recipeSource = document.querySelector('.source a');
var $recipeImage = document.querySelector('.recipe-image img');
var $recipeIngredients = document.querySelector('.recipe-ingredients tbody');
var $recipeInstructions = document.querySelector('.recipe-instructions');

// var $categoryView = document.querySelector('.categories');

getRandomRecipe(); // Will change this so it displays the currentRecipe from data

function getRandomRecipe() {
  var recipe = new XMLHttpRequest();
  recipe.addEventListener('load', function (event) {
    var recipeJSON = JSON.parse(this.responseText);
    // console.log(recipeJSON);
    viewRecipe(recipeJSON);
    data.currentRecipe = recipeJSON.meals[0].idMeal;

  });
  recipe.open('GET', 'https://www.themealdb.com/api/json/v1/1/random.php');
  recipe.send();
}

// function getCategories() {
//   var categories = new XMLHttpRequest();
//   categories.addEventListener('load', function (event) {
//     var categoriesJSON = JSON.parse(this.responseText);
//     // console.log(categoriesJSON);

//     for (var i = 0; i < categoriesJSON.categories.length; i++) {
//       var $categoryLink = document.createElement('a');
//       $categoryLink.textContent = categoriesJSON.categories[i].strCategory;

//       $categoryView.appendChild($categoryLink);
//     }

//   });
//   categories.open('GET', 'https://www.themealdb.com/api/json/v1/1/categories.php');
//   categories.send();
// }

// function getCategorieRecipes(category) {
//   var categorieRecipes = new XMLHttpRequest();
//   categorieRecipes.addEventListener('load', function (event) {
//     var categorieRecipesJSON = JSON.parse(this.responseText);
//     // console.log(categorieRecipesJSON);
//     var $listItemTesting = document.createElement('a');
//     $listItemTesting.textContent = categorieRecipesJSON.meals[0].strMeal;
//     $categoryView.appendChild($listItemTesting);

//   });
//   categorieRecipes.open('GET', 'https://www.themealdb.com/api/json/v1/1/filter.php?c=' + category);
//   categorieRecipes.send();
// }

function viewRecipe(recipeJSON) {
  $recipeName.textContent = recipeJSON.meals[0].strMeal;
  if (recipeJSON.meals[0].strSource) {
    $recipeSource.textContent = recipeJSON.meals[0].strSource.slice(12); // change to a link and clean up url
    $recipeSource.setAttribute('href', recipeJSON.meals[0].strSource);
  }
  $recipeImage.setAttribute('src', recipeJSON.meals[0].strMealThumb);
  for (var j = 1; j < 21; j++) {
    if (recipeJSON.meals[0]['strIngredient' + j]) {
      $recipeIngredients.appendChild(getIngredients(recipeJSON.meals[0]['strIngredient' + j], recipeJSON.meals[0]['strMeasure' + j]));
    }
  }
  var instructions = recipeJSON.meals[0].strInstructions.split('\n');
  for (var i = 0; i < instructions.length; i++) {
    var $recipeStep = document.createElement('p');
    $recipeStep.setAttribute('class', 'recipe-step');
    $recipeStep.textContent = instructions[i];
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

// function createMealCard() {

// }
