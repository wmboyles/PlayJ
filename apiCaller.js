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

var categories_clues = []

async function requestClues() {
    // Get NUM_CATEGORIES categories async, each with at least NUM_CLUES_PER_CATEGORY clues
    while (categories_clues.length < NUM_CATEGORIES) {
        var promises = [];
        for (var i = 0; i < NUM_CATEGORIES - categories_clues.length; i++) {
            const offset = Math.floor(1 + Math.random() * MAX_OFFSET);
            promises.push(
                fetch('https://jservice.io/api/category?id=' + offset).then(res => res.json()).then(category => {
                    if (category.clues.length >= NUM_CLUES_PER_CATEGORY) {
                        categories_clues.push(category);
                    } else {
                        console.warn("Category '" + category.title + "' does not have enough clues. Retrying...");
                    }
                })
            );
        }
        await Promise.all(promises)
    }
}


async function getClues() {
    await requestClues();

    for (const [categoryIndex, category] of categories_clues.entries()) {
        buttons[0][categoryIndex].button_text = category.title;

        for (const [clueIndex, clue] of category.clues.slice(0, NUM_CLUES_PER_CATEGORY).entries()) {
            var button = buttons[clueIndex + 1][categoryIndex];

            button.button_text = "" + (200 * (clueIndex + 1));
            button.clue = clue.question;
            button.answer = clue.answer;
            button.air_date = clue.airdate;
            button.category = category.title;
        }
    }
}
