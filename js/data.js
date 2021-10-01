/* exported data */

var data = {
  currentRecipe: null,
  favorites: [],
  currentView: null
};

var previousData = localStorage.getItem('user-data');

if (previousData) {
  var previousDataJSON = JSON.parse(previousData);
  data = previousDataJSON;
}

window.addEventListener('beforeunload', function (event) {
  var dataString = JSON.stringify(data);
  this.localStorage.setItem('user-data', dataString);
});
