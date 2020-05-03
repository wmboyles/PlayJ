/**
This file is responsible for interacting with the jService API. Ideally, all requests to the API
should be made through create.js. That is, after the necessary API calls to initialize the game, nodeName
more API calls are made for the duration of the game.
*/

// Not all of the below TODO's will necessarily be done. It depends on the design and features we include.

// TODO: some state variables: maybe a air date (if we're doing that), categories, or questions/answers.

// TODO: a function that selects 6 different categories, each with questions that have the right dollar amounts.

// TODO: a function that takes an object from create.js and fills in the information for the corresponding question.
var categories = []
var clues = [];
function initRequests() {
  var x =  Math.floor(1 + Math.random() * 18408);
  var cat_req = new XMLHttpRequest();
  cat_req.open('GET', 'https://jservice.io/api/categories?count=6&offset=' + x ,false)
  cat_req.send();
  var arr = JSON.parse(cat_req.response);
  
  cat_req.abort();


  arr.forEach(cat => {
    categories.push(cat.title);
    var clue_req = new XMLHttpRequest();
    clue_req.open("GET", "https://jservice.io/api/clues?category="+cat.id, false);
    clue_req.send();
    var arr2 = JSON.parse(clue_req.response);
    for(var i = 0; i < 5; i++){
      clues.push(arr2[i]); 
    }
    
    clue_req.abort();
  });
  console.log(categories);
  console.log(clues);
}


function display() {
  console.log("Running Display")
  for (var i = 0; i < 6; i++) { // row
    for (var j = 0; j < 6; j++) { // column
        if (i == 0) {
           buttons[i][j].button_text = categories[j];
        } else {
           buttons[i][j].button_text = "" + (200 * i);
           var my_clue = clues[5 * j + (i-1)];
           buttons[i][j].clue = my_clue.question;
           //buttons[i][j].value = my_clue.value;
           buttons[i][j].answer = my_clue.answer;
           buttons[i][j].category = categories[j];
           buttons[i][j].air_date = my_clue.airdate; 
        }
    }
  }
}
