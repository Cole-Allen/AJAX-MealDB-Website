var $recipeName = document.querySelector('.title h1');
var $recipeSource = document.querySelector('.source h3');
var $recipeImage = document.querySelector('.recipe-image img');
var $recipeInstructions = document.querySelector('.recipe-instructions p');

getRandomRecipe();

function getRandomRecipe() {
  var recipe = new XMLHttpRequest();
  recipe.addEventListener('load', function (event) {
    var recipeJSON = JSON.parse(this.responseText);
    console.log(recipeJSON);
    $recipeName.textContent = recipeJSON.meals[0].strMeal;
    $recipeSource.textContent = recipeJSON.meals[0].strSource; // change to a link
    $recipeImage.setAttribute('src', recipeJSON.meals[0].strMealThumb);
    $recipeInstructions.textContent = recipeJSON.meals[0].strInstructions; // Make instructions more readable
  });
  recipe.open('GET', 'https://www.themealdb.com/api/json/v1/1/random.php');
  recipe.send();
}

function getIngredients(recipe) {

}
