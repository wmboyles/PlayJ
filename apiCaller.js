/**
This file is responsible for interacting with the jService API. Ideally, all requests to the API
should be made through create.js. That is, after the necessary API calls to initialize the game, nodeName
more API calls are made for the duration of the game.
*/

// Not all of the below TODO's will necessarily be done. It depends on the design and features we include.

// TODO: some state variables: maybe a air date (if we're doing that), categories, or questions/answers.

// TODO: a function that selects 6 different categories, each with questions that have the right dollar amounts.

// TODO: a function that takes an object from create.js and fills in the information for the corresponding question.
const MAX_OFFSET = 5500;

var categories = []
var clues = [];

function initRequests() {
    // Get NUM_CATEGORIES categories, each with at least NUM_CLUES_PER_CATEGORY clues
    var categories_arr = [];
    for (var i = 0; i < NUM_CATEGORIES; i++) {
        const offset = Math.floor(1 + Math.random() * MAX_OFFSET);
        const cat_req = new XMLHttpRequest();
        cat_req.open('GET', 'https://jservice.io/api/categories?count=1&offset=' + offset, false)
        cat_req.send();

        const category_response = JSON.parse(cat_req.response)[0];
        if (category_response.clues_count < NUM_CLUES_PER_CATEGORY) {
            console.log("Category " + category_response + " has less than " + NUM_CLUES_PER_CATEGORY + " clues. Retrying with different category.")
            i--;
        } else {
            categories_arr.push(JSON.parse(cat_req.response)[0]);
        }

        cat_req.abort();
    }

    // For each category, get NUM_CLUES_PER_CATEGORY clues
    categories_arr.forEach(category => {
        categories.push(category.title);

        const clue_req = new XMLHttpRequest();
        clue_req.open("GET", "https://jservice.io/api/clues?category=" + category.id, false);
        clue_req.send();

        const clue_res = JSON.parse(clue_req.response);
        clue_res.forEach(clue => {
            clues.push(clue);
        });

        clue_req.abort();
    });
}


function display() {
    // Fill the category titles
    for (const [index, category] of categories.entries()) {
        buttons[0][index].button_text = category;
    }

    // Fill the category clues
    for (var i = 1; i < NUM_CLUES_PER_CATEGORY + 1; i++) { // row
        for (var j = 0; j < NUM_CATEGORIES; j++) { // column
            buttons[i][j].button_text = "" + (200 * i);

            const my_clue = clues[NUM_CLUES_PER_CATEGORY * j + (i - 1)];
            buttons[i][j].clue = my_clue.question;
            buttons[i][j].answer = my_clue.answer;
            buttons[i][j].air_date = my_clue.airdate;
            buttons[i][j].category = categories[j];
        }
    }
}
