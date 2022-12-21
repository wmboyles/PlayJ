/** 
This file creates all elements seen on screen. 
Responsibility of dealing with the API is in apiCaller.js, and responsibility of updating game
state is in gameRunner.js. This file should only be referenced after gameRunner.js and apiCaller.js
have been referenced.
*/

const NUM_CATEGORIES = 6;
const NUM_CLUES_PER_CATEGORY = 5;

/** A 2D array of clue objects. The first row is of categories. */
var buttons;
/** The number of row / cols in the grid of clue buttons. These values are both 6 in normal J! */
var button_grid_dimensions = { rows: NUM_CATEGORIES, cols: NUM_CLUES_PER_CATEGORY + 1 };

/** 
Creates the right hand portion of the screen that displays the clue, question info, answer textbox,
and control buttons
*/
function createSidebar() {
    var sidebar = document.createElement("div");
    sidebar.className = "d-flex flex-column flex-grow-1 mx-2 mt-2";
    sidebar.id = "sidebar";

    var scoreE = document.createElement("h1");
    scoreE.className = "text-center m-0"
    scoreE.id = "player-score"
    scoreE.innerText = "SCORE: $0";
    sidebar.appendChild(scoreE);

    var question_jumbotron = document.createElement("div");
    question_jumbotron.className = "jumbotron jumbotron-fluid my-2 flex-grow-1";

    var clue_text = document.createElement("h2");
    clue_text.className = "text-center align-middle";
    clue_text.id = "clue-text";
    clue_text.innerText = "Select a Question";
    question_jumbotron.appendChild(clue_text);
    sidebar.appendChild(question_jumbotron);

    var clue_category = document.createElement("h4");
    clue_category.className = "text-center mt-0 p-0";
    clue_category.id = "clue-category";
    clue_category.innerText = "Category: ";
    sidebar.appendChild(clue_category);

    var clue_value = document.createElement("h4");
    clue_value.className = "text-center mb-2 p-0";
    clue_value.id = "clue-value";
    clue_value.innerText = "Value: ";
    sidebar.appendChild(clue_value);

    var clue_airdate = document.createElement("h4");
    clue_airdate.className = "text-center mb-2 p-0";
    clue_airdate.id = "clue-airdate";
    clue_airdate.innerText = "Air Date: ";
    sidebar.appendChild(clue_airdate);

    var answer_field = document.createElement("div");
    answer_field.className = "input-group";

    var input = document.createElement("input");
    input.type = "text";
    input.className = "form-control"
    input.id = "player-answer";
    input.placeholder = "Answer (in the form of a question)";
    answer_field.appendChild(input);
    sidebar.appendChild(answer_field);

    var button_row = document.createElement("div");
    button_row.className = "d-flex flex-row";

    var submit_button = document.createElement("button");
    submit_button.type = "button";
    submit_button.className = "mt-2 btn btn-primary btn-block border border-light";
    submit_button.id = "answer-submit";
    submit_button.innerText = "Submit Answer";
    submit_button.disabled = true;
    submit_button.addEventListener("click", function () {
        submitAnswer();
    });
    button_row.appendChild(submit_button);

    var answer_override = document.createElement("button");
    answer_override.type = "button";
    answer_override.className = "mt-2 btn btn-primary btn-block border border-light";
    answer_override.id = "answer-override";
    answer_override.innerText = "I'm Right";
    answer_override.disabled = true;
    answer_override.addEventListener("click", function () {
        answerOverride();
    });
    button_row.appendChild(answer_override);
    sidebar.appendChild(button_row);


    document.getElementById("container").appendChild(sidebar);
}

/** Initializes an empty button array of dimensions specified in button_grid_dimensions. */
function createButtonArray() {
    buttons = new Array(button_grid_dimensions.rows);

    for (var i = 0; i < buttons.length; i++) {
        buttons[i] = new Array(button_grid_dimensions.cols);
        for (var j = 0; j < buttons[i].length; j++) {
            buttons[i][j] = {
                button_element: null,                       // The actual button element.
                button_text: "ERROR",              // The text for the button. Either a category name or clue point value
                value: 200 * i,                          // Point value of clue. Category names have point value of 0.
                clue: "ERROR",        // The actual text of the clue to be displayed
                answer: "ERROR",                          // The answer to the clue
                category: "ERROR", // The category of the clue
                air_date: "ERROR"  // The air date of this clue
            };
        }
    }
}

/** Creates the board of clue and category tiles with values as a grid of buttons. */
function createBoard() {
    createButtonArray();
    display(); // calls APIcaller.js to initialize button field with actual data

    var board = document.createElement("div");
    board.className = "d-flex flex-column";
    board.id = "board-buttons";

    for (var r = 0; r < buttons.length; r++) {
        var myrow = document.createElement("div");
        myrow.className = r == 0 ? "d-flex flex-row mx-1 my-2" : "d-flex flex-row mx-1";

        for (var c = 0; c < buttons[r].length; c++) {
            // You gotta wrap everything in a function here so that the click event listener passes
            // the right value of r,c instead of the value after the loops finish.
            (function (r, c) {
                var mycol = document.createElement("div");
                mycol.className = "d-flex flex-column";

                var btn = document.createElement("button");
                btn.type = "button";
                btn.style.width = "10em"; // If you use a different number of clues, these values may need to change.
                btn.style.height = "7em";
                btn.className = "btn btn-primary btn-block border border-light"
                btn.disabled = false;
                btn.addEventListener("click", function () {
                    clueClick(r, c);
                });

                var btnSpan = document.createElement("span");
                if (r == 0) {
                    btnSpan.style.color = "white";
                } else {
                    btnSpan.style.color = "yellow";
                    btnSpan.style.fontSize = "36pt";
                }
                btnSpan.innerHTML = r == 0 ? "<strong>" + buttons[r][c].button_text.toUpperCase() + "</strong>" : "<strong>$" + buttons[r][c].button_text + "</strong>";


                btn.appendChild(btnSpan);
                mycol.appendChild(btn);
                myrow.appendChild(mycol);

                buttons[r][c].button_element = btn;

                // TODO: use the API to fill in these values with the actual things

                // Good option is probably to initialize the button_element only here, pass the
                // function to the API handler, which will fill in the rest.

                // Another option may be to pass in the entire buttons array after this initial
                // stuff, and let the API interaction fill in the entire array.

                // One lazy option with the API interaction may be just to ask the API for all
                // clues from a specific air date, and fill in as needed.
                /*
                buttons[r][c] = {
                    button_element: btn,                       // The actual button element.
                    button_text: "" + r * 200,                 // The text for the button. Either a category name or clue point value
                    value: r * 200,                            // Point value of clue. Category names have point value of 0.
                    clue: "Test Clue " + r + ", " + c,         // The actual text of the clue to be displayed
                    answer: "answer",                          // The answer to the clue
                    category: "Test Category " + r + ", " + c, // The category of the clue
                    air_date: "Test Air Date " + r + ", " + c  // The air date of this clue
                };
                */
            }(r, c));
        }

        board.appendChild(myrow);
    }



    document.getElementById("container").appendChild(board);


}

/** 
Creates the view to begin the game: the game board and sidebar.

This shuld be the only function in ALL files named create because the HTML calls create(); onload,
so it needs to not be confusedd about which function to use.
*/
function create() {
    var container = document.createElement("div");
    container.className = "d-flex flex-row";
    container.id = "container";
    document.body.appendChild(container);

    // TODO: May want to call API here to choose some categories and maybe even questions

    initRequests();
    createBoard();
    createSidebar();
}