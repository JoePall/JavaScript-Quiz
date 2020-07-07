// JavaScript Quiz Game
var game = {
    score: 0,
    playerName: "",
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
        // Sets the allotted time based on the amount of questions
        game.allotedTime = game.questions.length * 15;

        game.elapsedTime = 0;
        game.score = 0;
        game.result = "";
        game.questionIndex = 0;

        $("#score").html("Score: 0");
        $("#timer").html(game.allotedTime + " seconds left");

        game.showBeforeQuizHTML();
    },

    // Displays question and associated options
    askQuestion: () => {
        var question = game.questions[game.questionIndex];

        $("#question-options > button").each((i) =>
            $("#button-" + (i + 1)).html((i + 1) + ". " + question["options"][i]));

        $("#question").html(question["text"]);
    },

    // Handles the users response to the question
    onResponse: (response) => {
        // If the users answer matched the games answer, increment the score by 1 and display it
        var answer = (response == game.questions[game.questionIndex]["answer"]);
        if (answer) $("#score").html("Score: " + (++game.score));

        // game.showAnswerResult(answer);

        game.questionIndex++;

        // Stops the game if there are no more questions, otherwise ask the next question
        if (game.questionIndex == game.questions.length) game.stopQuiz();
        else game.askQuestion();
    },

    // Starts the Quiz 
    startQuiz: () => {
        // Set Default Values for variables
        game.init();

        game.showInQuizHTML();

        //Begin Game
        game.startTimer();
        game.askQuestion();
    },

    // Stops the Quiz
    stopQuiz: () => {
        game.stopTimer();

        $("#subtitle").html("Game Over!");
        game.showAfterQuizHTML();
    },

    saveScore: () => {
        game.playerName = $("#name").val();

        if (game.score > 0 && game.playerName.length > 0) {
            game.setHighScores();
        }

        game.showHighScores();
    },

    showHighScores: () => {
        var result = game.getHighScoresHTML();

        $("#results").html(result);

        game.showHighScoresHTML();
    },

    // Gets an ordered list with the 
    getHighScoresHTML: () => {
        var result = "<ol>";
        var myEntry = ($("#name").val() + ": " + game.score);

        var highlighted = false;
        var highScores = JSON.parse(localStorage.getItem("highScores"));
        $.each(highScores, (i, score) => {
            var text = score[0] + ": " + score[1];

            result += "<li>";

            if (text == myEntry && !highlighted) {
                result += "<strong>" + text + "</strong>";
                highlighted = true;
            }
            else result += text;

            result += "<br></li>";
        });

        result += "</ol>"

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
    setHighScores: () => {
        // Get the current high scores
        var highScores = JSON.parse(localStorage.getItem("highScores"));
        var myScore = [game.playerName, game.score];

        if (highScores == undefined) highScores = [myScore];
        else {
            // Add the value
            highScores.push(myScore);

            // Sort all
            highScores = highScores.sort((a, b) => b[1] - a[1]);
        }

        // Get top 5 if needed
        if (highScores.length > 5) {
            highScores.splice(5);
        }

        // Save the scores
        localStorage.setItem("highScores", JSON.stringify(highScores));
    },

    resetHighScores: () => {
        localStorage.removeItem("highScores");
        $("#results").html("");
    },

    // Showing and hiding of HTML based on state
    quizStates: [".before-quiz", ".in-quiz", ".after-quiz", ".show-high-scores"],

    showBeforeQuizHTML: () => {
        game.showHTML(game.quizStates[0]);
    },

    showInQuizHTML: () => {
        game.showHTML(game.quizStates[1]);
    },

    showAfterQuizHTML: () => {
        game.showHTML(game.quizStates[2]);
    },

    showHighScoresHTML: () => {

        game.showHTML(game.quizStates[3]);
    },

    showHTML: (selectedState) => {
        game.quizStates.forEach(state => $(state).fadeOut(1));
        $(selectedState).fadeIn(1);
    },
}

$("#start").click(() => game.startQuiz());
$("#save").click(() => game.saveScore());
$("#reset").click(() => game.resetHighScores());
$("#view-high-scores").click(() => game.showHighScores());

$(document).ready(() => {
    $("#question-options").click((event) => {
        game.onResponse(event.target.value);
    });
});
game.init();