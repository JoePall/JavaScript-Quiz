// JavaScript Quiz Game
var game = {
    highScores: [],
    score: 0,
    questionIndex: 0,
    timerInterval: "",
    allotedTime: 120,
    elapsedTime: 0,

    // JavaScript fundamentals questions
    questions: [["Is JavaScript case sensitive?", true],
    ['Is <code>==</code> type sensitive?', false],
    ['Is <code>var array = {};</code> a valid implementation of an array?', false],
    ['Is <code>alert("Are you sure about this?");</code> valid in JavaScript?', true],
    ['Is <code>for (let i = 0; i < array.length; i++)</code> a valid for loop in JavaScript?', true],
    ['Is <code>(7 => 5)</code> valid in JavaScript?', false]],

    // Initialize default values
    init: () => {
        // Hide quiz buttons and display start button
        $("#start-button").fadeIn(1);
        $("#yes-button").fadeOut(1);
        $("#no-button").fadeOut(1);

        // Sets the allotted time based on the amount of questions
        game.allotedTime = game.questions.length * 15;
    },

    // Displays a question to the user
    askQuestion: () => $("#status").html(game.questions[game.questionIndex][0]),

    // Handles the users response to the question
    onResponse: (response) => {
        // If the users answer matched the games answer increment the score by 1 and display it.
        if (response == game.questions[game.questionIndex][1]) {
            $("#score").html("Score: " + ++game.score);
        }

        // Stops the game if there are no more questions, otherwise ask the next question.
        if (++game.questionIndex >= game.questions.length) game.stopQuiz();
        else game.askQuestion();
    },

    // Starts the Quiz 
    startQuiz: () => {
        // Set Default Values for variables
        game.questionIndex = 0;
        game.score = 0;

        // Display quiz buttons and hide start button
        $("#start-button").fadeOut(10);
        $("#yes-button").fadeIn(10);
        $("#no-button").fadeIn(10);
        $("#player-name").fadeOut(10);

        //Begin Game
        game.startTimer();
        game.askQuestion();
    },

    // Stops the Quiz
    stopQuiz: () => {
        game.stopTimer();
        highScores = game.storeHighScores();

        var result = "Game Over!<br><br>High Scores<br>";
        $.each(highScores, (i, score) => {
            var text = score[0] + ": " + score[1];
            var current = ($("#player-name").val() + ": " + game.score);
            if (text == current) {
                result += "<strong>" + text + "</strong><br>";
            }
            else result += text + "<br>";
        });
        $("#status").html(result);

        $("#start-button").fadeIn(10);
        $("#yes-button").fadeOut(10);
        $("#no-button").fadeOut(10);
        $("#player-name").fadeIn(10);
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

            // Sort all and get top 5
            highScores = highScores.sort((a, b) => b[1] - a[1]);

            console.log(highScores);

        }

        if (highScores.length > 5) {
            highScores.splice(5);
        }

        // Save the top 5
        localStorage.setItem("highScores", JSON.stringify(highScores));

        return highScores;
    },
}

$("#start-button").click(() => game.startQuiz());
$("#no-button").click(() => game.onResponse(false));
$("#yes-button").click(() => game.onResponse(true));

game.init();