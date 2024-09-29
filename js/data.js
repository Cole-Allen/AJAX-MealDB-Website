/* exported data */

var data = {
  currentRecipe: null,
  favorites: [],
  currentView: null
};

// Collect data from local storage
var previousData = localStorage.getItem('user-data');

if (previousData) {
  var previousDataJSON = JSON.parse(previousData);
  data = previousDataJSON;
}

// When page is closed, save data object to local storage
window.addEventListener('beforeunload', function (event) {
  var dataString = JSON.stringify(data);
  this.localStorage.setItem('user-data', dataString);
});
