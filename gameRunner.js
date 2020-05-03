/**
This file runs all aspects of the game as the user interacts with it. This includes all items that
do not relate to the creation of the view or API calls. Most variables are meant to keep track of
the game's internal state (player score, is a clue currently in play, etc.). Functions here assume
that the buttons variable 2D array has been fully initialized.
*/

/** The variable buttons is a 2D array of objects created in create.js */

/** Is a question currently in play? */
var questionInPlay = false;
/** The user's score */
var score = 0;
/** The point value of the most recently clicked question */
var questionValue = 0;
/** The answer to the clicked question */
var questionAnswer;

/** Updates the score displayed to the user to reflect the value of the score variable. */
function updateScore(){
    if(score < 0){
        document.getElementById("player-score").innerText = "SCORE: -$" + Math.abs(score);
    } else {
        document.getElementById("player-score").innerText = "SCORE: $" + score;
    }
}

/** 
What happens when the "I'm Right" button is pressed, overriding what would otherwise be a wrong
answer, and correcting the points to match.
*/
function answerOverride() {
    var submitAnswerButton = document.getElementById("answer-submit");
    var overrideAnswerButton = document.getElementById("answer-override");
    var clueText = document.getElementById("clue-text");
    var playerAnswerBox = document.getElementById("player-answer");
    
    if(questionInPlay){
        //questionInPlay = false;
        
        score += 2*questionValue; // once to get back to original score, and once for being right
        updateScore();
        
        clueText.innerText = "Correct! The answer is: " + questionAnswer + ".";
        
        overrideAnswerButton.disabled = true;
        submitAnswerButton.innerText = "Next Question";
    }
}

/**
What happens when the left-hand button is pressed in the sidebar.
This button acts both as a submit button and next question button.
*/
function submitAnswer() {
    var submitAnswerButton = document.getElementById("answer-submit");
    var overrideAnswerButton = document.getElementById("answer-override");
    var clueText = document.getElementById("clue-text");
    var playerAnswerBox = document.getElementById("player-answer");
    
    if(submitAnswerButton.innerText === "Submit Answer"){
        // Get the answer entered in the textbox
        // Compare it to the actual answer
        // Tell the user if they were right/wrong; ask to display answer; change points.
        if(playerAnswerBox.value == questionAnswer){
            score += questionValue;
            clueText.innerHTML = "Correct! The answer is: " + questionAnswer + ".";
        } else {
            // Enable answer override option if user was wrong
            score -= questionValue;
            overrideAnswerButton.disabled = false;
            clueText.innerHTML = "Incorrect. The answer is: " + questionAnswer + ".";
        }
        updateScore();
        
        // Ask user to go to the next question.
        submitAnswerButton.innerText = "Next Question";
    } else if (submitAnswerButton.innerText === "Next Question"){
        // Clear the user's answer from the answer box
        playerAnswerBox.value = "";
        
        // A question is no longer in play, so disable the submit and override buttons.
        questionInPlay = false;
        submitAnswerButton.disabled = true;
        overrideAnswerButton.disabled = true;
        
        // Change the text that displayed the clue to tell the user to select a question.
        clueText.innerText = "Select a Question"
        
        // Clear is clue info (category, value, air date)
        document.getElementById("clue-category").innerText = "Category: ";
        document.getElementById("clue-value").innerText = "Value: ";
        document.getElementById("clue-airdate").innerText = "Air Date: ";
        
        // Change the "Next Question" button back into the "Submit Answer" button.
        submitAnswerButton.innerText = "Submit Answer";
    }
}

/** Checks if the game is over. */
function gameOver() {
    for (var i = 0; i < buttons.length; i++) {
        for (var j = 0; j < buttons[i].length; j++) {
            if (!buttons[i][j].button_element.disabled) {
                return false;
            }
        }
    }
    return true;
}

/** Checks if category c is finished: all questions in that category have been clicked. */
function categoryFinished(c) {
    for (var row = 1; row < button_grid_dimensions.rows; row++) {
        if (!buttons[row][c].button_element.disabled) {
            return false;
        }
    }
    return true;
}

/** What happens when the clue button in row r column c of clues is clicked. */
function clueClick(r, c) {
    // Ignore presses if question is already in play
    if(questionInPlay) return;
    
    // If click category, pick lowest-value unanswered question in category
    if (r == 0) {
        for (var row = 1; row < button_grid_dimensions.rows; row++) {
            if (!buttons[row][c].button_element.disabled) {
                clueClick(row, c);
                return;
            }
        }
    }
    
    // Say there is not a question in play, and enable submit button
    questionInPlay = true;
    document.getElementById("answer-submit").disabled = false;

    // Disable the clicked button and display the corresponding clue text
    buttons[r][c].button_element.disabled = true;
    document.getElementById("clue-text").innerText = buttons[r][c].clue;
    
    // Save the answer for comparison for when the user enters an answer
    questionAnswer = buttons[r][c].answer;

    // Show the clue category, point value, and air date. Save the question value to add or deduct points.
    document.getElementById("clue-category").innerText = "Category: " + buttons[r][c].category;
    questionValue = buttons[r][c].value;
    document.getElementById("clue-value").innerText = "Value: $" + questionValue;
    document.getElementById("clue-airdate").innerText = "Air Date: " + buttons[r][c].air_date;

    // Check if category is finished and disable category button if it is.
    if (categoryFinished(c)) {
        buttons[0][c].button_element.disabled = true;
    }
    
    // TODO: What should happen at the end of the game? */
}