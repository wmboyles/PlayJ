/**
This file is responsible for interacting with the jService API. Ideally, all requests to the API
should be made through create.js. That is, after the necessary API calls to initialize the game, nodeName
more API calls are made for the duration of the game.
*/

// Not all of the below TODO's will necessarily be done. It depends on the design and features we include.

// TODO: some state variables: maybe a air date (if we're doing that), categories, or questions/answers.

// TODO: a function that selects 6 different categories, each with questions that have the right dollar amounts.

// TODO: a function that takes an object from create.js and fills in the information for the corresponding question.
var cat_req = new XMLHttpRequest();
cat_req.open('GET', 'http://jservice.io/api/categories?count=6', false)
cat_req.send();
var arr = JSON.parse(cat_req.response);

var categories = []
var clues = [];
arr.forEach(cat => {
  categories.push(cat.title);
  var clue_req = new XMLHttpRequest();
  clue_req.open("GET", "http://jservice.io/api/clues?category="+cat.id, false);
  clue_req.send();
  var arr2 = JSON.parse(clue_req.response);
  for(var i = 0; i < 5; i++){
    clues.push(arr2[i]); 
  }
});
console.log(categories);
console.log(clues);
