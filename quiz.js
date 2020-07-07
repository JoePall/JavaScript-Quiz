// JavaScript Quiz Game
var game = {
    score: 0,
    playerName: "",
    questionIndex: 0,
    timerInterval: "",
    allotedTime: 120,

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

        game.score = 0;
        game.result = "";
        game.questionIndex = 0;

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

        game.questionIndex++; // Move to next question

        // Stops the game if there are no more questions, otherwise ask the next question
        if (game.questionIndex == game.questions.length) game.stopQuiz();
        else game.askQuestion();
    },

    // Starts the Quiz 
    startQuiz: () => {
        // Set default values for variables
        game.init();

        // Display score
        $("#score").html("Score: 0");

        // Begin Quiz
        game.startTimer();
        game.showInQuizHTML();
        game.askQuestion();
    },

    // Stops the Quiz
    stopQuiz: () => {
        clearInterval(game.timerInterval); // Stop timer

        $("#subtitle").html("Game Over!");

        game.showAfterQuizHTML();
    },

    // Saves score then displays high scores
    saveScore: () => {
        game.playerName = $("#name").val();

        if (game.score > 0 && game.playerName.length > 0) 
            game.setHighScores();

        game.showHighScores();
    },

    // Shows the high scores
    showHighScores: () => {
        var result = game.getHighScoresHTML();

        $("#results").html(result);

        game.showHighScoresHTML();
    },

    // Gets an ordered list with the high scores (highlights entry if applicable) 
    getHighScoresHTML: () => {
        var result = "";
        var myEntry = ($("#name").val() + ": " + game.score);
        
        var highlighted = false;
        var highScores = JSON.parse(localStorage.getItem("highScores"));
        if (!highScores > 0) return;
        $.each(highScores, (i, score) => {
            var text = score[0] + ": " + score[1];

            result += "<li>";

            if (text == myEntry && !highlighted) {
                result += "<strong>" + text + "</strong>";
                highlighted = true;
            }
            else result += text;

            result += "</li>";
        });

        return result;
    },

    // Starts the quiz timer
    startTimer: () => {
        var timeLeft = game.allotedTime;
        $("#timer").html(timeLeft-- + " seconds left");
        game.timerInterval = setInterval(() => {
            $("#timer").html(timeLeft + " seconds left");
            timeLeft--;
            
            if (timeLeft < 0) game.stopQuiz(); // Stop when time runs out.
        }, 1000);
    },

    // Updates the high scores and stores to local storage
    setHighScores: () => {

        // Get the current high scores
        var highScores = JSON.parse(localStorage.getItem("highScores"));
        var myScore = [game.playerName, game.score];

        // Create an array if none exists, otherwise add the entry and sort and return top 5
        if (highScores == undefined) highScores = [myScore];
        else {
            highScores.push(myScore);
            highScores = highScores.sort((a, b) => b[1] - a[1]);
            if (highScores.length > 5) highScores.splice(5);
        }

        // Save the scores
        localStorage.setItem("highScores", JSON.stringify(highScores));
    },

    // removes highScores and content of results
    resetHighScores: () => {
        localStorage.removeItem("highScores");
        $("#results").html("");
    },

    // Shows or hides HTML based on quiz state
    quizStates: [".before-quiz", ".in-quiz", ".after-quiz", ".show-high-scores"],

    showBeforeQuizHTML: () => game.showHTML(game.quizStates[0]),
    showInQuizHTML: () => game.showHTML(game.quizStates[1]),
    showAfterQuizHTML: () => game.showHTML(game.quizStates[2]),
    showHighScoresHTML: () => game.showHTML(game.quizStates[3]),

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