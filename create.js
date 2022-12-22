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
async function createSidebar() {
    const submit_button = document.getElementById("answer-submit");
    submit_button.addEventListener("click", () => submitAnswer());

    const answer_override = document.getElementById("answer-override");
    answer_override.addEventListener("click", () => answerOverride());
}

/** Initializes an empty button array of dimensions specified in button_grid_dimensions. */
function createButtonArray() {
    buttons = new Array(button_grid_dimensions.rows);

    for (var i = 0; i < buttons.length; i++) {
        buttons[i] = new Array(button_grid_dimensions.cols);
        for (var j = 0; j < buttons[i].length; j++) {
            buttons[i][j] = {
                button_element: null,                       // The actual button element.
                button_text: "...",              // The text for the button. Either a category name or clue point value
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
async function createBoard() {
    var board = document.getElementById("board-buttons");
    createButtonArray();

    // calls APIcaller.js to initialize button field with actual data
    await getClues(); 

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
                btn.addEventListener("click", () => clueClick(r,c));

                var btnSpan = document.createElement("span");
                if (r == 0) {
                    btnSpan.style.color = "white";
                } else {
                    btnSpan.style.color = "yellow";
                    btnSpan.style.fontSize = "36pt";
                }
                btnSpan.innerHTML = "<strong>" + (r == 0 ? buttons[r][c].button_text.toUpperCase() : "$" + buttons[r][c].button_text) + "</strong>";;


                btn.appendChild(btnSpan);
                mycol.appendChild(btn);
                myrow.appendChild(mycol);

                buttons[r][c].button_element = btn;
            }(r, c));
        }

        board.appendChild(myrow);
    }
}

/** 
Creates the view to begin the game: the game board and sidebar.

This should be the only function in ALL files named create because the HTML calls create(); onload,
so it needs to not be confused about which function to use.
*/
function create() {
    createBoard();
    createSidebar();
}