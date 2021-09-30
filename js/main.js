var $recipeName = document.querySelector('.title h1');
var $recipeSource = document.querySelector('.source h3');
var $recipeImage = document.querySelector('.recipe-image img');
var $recipeIngredients = document.querySelector('.recipe-ingredients tbody');
var $recipeInstructions = document.querySelector('.recipe-instructions');

getRandomRecipe();

function getRandomRecipe() {
  var recipe = new XMLHttpRequest();
  recipe.addEventListener('load', function (event) {
    var recipeJSON = JSON.parse(this.responseText);
    console.log(recipeJSON);
    $recipeName.textContent = recipeJSON.meals[0].strMeal;
    $recipeSource.textContent = recipeJSON.meals[0].strSource; // change to a link
    $recipeImage.setAttribute('src', recipeJSON.meals[0].strMealThumb);
    for (var j = 1; j < 21; j++) {
      $recipeIngredients.appendChild(getIngredients(recipeJSON.meals[0]['strIngredient' + j], recipeJSON.meals[0]['strMeasure' + j]));
    }
    var instructions = recipeJSON.meals[0].strInstructions.split('\n');
    for (var i = 0; i < instructions.length; i++) {
      var $recipeStep = document.createElement('p');
      $recipeStep.setAttribute('class', 'recipe-step');
      $recipeStep.textContent = instructions[i];
      $recipeInstructions.appendChild($recipeStep);
    }
  });
  recipe.open('GET', 'https://www.themealdb.com/api/json/v1/1/random.php');
  recipe.send();
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
