// JavaScript Quiz Game
var game = {
    highScores: [],
    score: 0,
    questionIndex: 0,
    timerInterval: "",
    allotedTime: 120,
    elapsedTime: 0,

    // JavaScript fundamentals questions and answers
    questions: [{
        text: "Commonly used Data Types in JavaScript do not include:",
        options: ["strings", "booleans", "alerts", "numbers"],
        answer: "2"
    },
    {
        text: "Arrays in JavaScript can be used to store _____.",
        options: ["strings", "booleans", "alerts", "numbers"],
        answer: "1"
    },
    {
        text: "The condition of an if/else statement is enclosed within: ",
        options: ["paranthesis", "square brackets", "curly brackets", "commas"],
        answer: "4"
    }
    ],

    // Initialize default values
    init: () => {
        game.elapsedTime = 0;
        game.score = 0;
        game.allotedTime = game.questions.length * 15;
        game.result = "";
        
        game.displayInitHTML(); // Sets the allotted time based on the amount of questions
    },

    // Displays question and associated options
    askQuestion: () => {
        var question = game.questions[game.questionIndex];

        for (let i = 0; i < 4; i++) {
            var n = (i + 1);
            $("#button-" + n).html(n + ". " + question["options"][i]);
        }

        $("#status").html(question["text"])
    },

    // Handles the users response to the question
    onResponse: (response) => {
        // If the users answer matched the games answer, increment the score by 1 and display it
        var answer = response == game.questions[game.questionIndex]["answer"];
        if (answer) $("#score").html("Score: " + (++game.score));

        game.displayAnswerResult(answer);

        game.questionIndex++;

        // Stops the game if there are no more questions, otherwise ask the next question
        if (game.questionIndex == game.questions.length) game.stopQuiz();
        else game.askQuestion();
    },

    // Starts the Quiz 
    startQuiz: () => {
        // Set Default Values for variables
        game.questionIndex = 0;
        game.score = 0;

        game.displayQuizHTML();

        //Begin Game
        game.startTimer();
        game.askQuestion();
    },

    // Stops the Quiz
    stopQuiz: () => {
        game.stopTimer();

        $("#save-option").fadeIn(1);
        $("#status").html("Game Over!");
    },

    saveScore: () => {
        $("#save-option").fadeOut(1);

        game.storeHighScores();
        
        var result = game.getHighScoresHTML();
        
        $("#results").html(result);
        game.displayResultHTML();
    },

    viewHighScoresModal: () => {
        var results = game.getHighScoresHTML();

        $("#results-modal-text").html(results);
    },

    getHighScoresHTML: () => {
        var result = "";

        var highlighted = false;
        $.each(game.highScores, (i, score) => {
            var text = score[0] + ": " + score[1];
            var current = ($("#player-name").val() + ": " + game.score);

            if (text == current && !highlighted) {
                result += "<strong>" + text + "</strong><br>";
                highlighted = true;
            }
            else result += text + "<br>";
        });

        return result;
    },

    // Starts the timer
    startTimer: () => {
        var timeLeft = game.allotedTime;
        game.timerInterval = setInterval(() => {
            $("#timer").html(timeLeft + " seconds left");
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(game.timerInterval);
                game.stopQuiz();
            }
        }, 1000);
    },

    // Stops the timer
    stopTimer: () => {
        clearInterval(game.timerInterval);
        game.elapsedTime = 0;
    },

    // Updates the high scores and stores to local storage
    storeHighScores: () => {
        // Get the current high scores
        var highScores = JSON.parse(localStorage.getItem("highScores"));
        var value = [$("#player-name").val(), game.score];

        if (highScores == undefined) highScores = [value];
        else {
            // Add the value
            highScores.push(value);

            // Sort all
            highScores = highScores.sort((a, b) => b[1] - a[1]);
        }

        // Get top 5 if needed
        if (highScores.length > 5) {
            highScores.splice(5);
        }

        // Save the scores
        localStorage.setItem("highScores", JSON.stringify(highScores));

        game.highScores = highScores;
    },

    resetHighScores: () => {
        localStorage.removeItem("highScores");
        $("#results").html("");
    },

    displayAnswerResult: (answer) => {
        $("#answer-result").fadeIn(10);
        setTimeout(() => {
            if (answer) $("#answer-result").html("You are right!") 
            else $("#answer-result").html("You are wrong!") 
            $("#answer-result").fadeOut(500);
        }, 5000);
    },

    displayResultHTML: () => {
        $("#start-button").fadeIn(1);
        $("#question-options").fadeOut(1);
        $("#reset-button").fadeIn(1);
        $("#results").fadeIn(1);
        $("#save-option").fadeOut(1);
    },

    displayQuizHTML: () => {
        $("#start-button").fadeOut(1);
        $("#question-options").fadeIn(1);
        $("#reset-button").fadeOut(1);
        $("#question-options").fadeIn(1);
        $("#results").fadeOut(1);
    },

    displayInitHTML: () => {
        $("#start-button").fadeIn(1);
        $("#question-options").fadeOut(1);
        $("#reset-button").fadeOut(1);
        $("#score").html("Score: 0");
        $("#timer").html(game.allotedTime + " seconds left");
        $("#results").fadeOut(1);
        $("#save-option").fadeOut(1);
    },
}

$("#reset-button").click(() => game.resetHighScores());
$("#start-button").click(() => game.startQuiz());
$("#save-score-button").click(() => game.saveScore());
$("#view-high-score").click(() => game.viewHighScoresModal());
$(document).ready(() => {
    $("#question-options").click((event) => {
        game.onResponse(event.target.value);
    });
});
game.init();