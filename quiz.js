var responseSection = document.getElementById("response-section");
var buttonNo = document.getElementById("no-button");
var buttonYes = document.getElementById("yes-button");
var buttonStart = document.getElementById("start-game-button");
var statusPrimary = document.getElementById("status-primary");
var statusSecondary = document.getElementById("status-secondary");


buttonStart.addEventListener("click", function(event) {
    event.preventDefault();
    game.startQuiz();
});    

buttonNo.addEventListener("click", function(event) {
    event.preventDefault();
    game.onAnswer(false);
});    

buttonYes.addEventListener("click", function(event) {
    event.preventDefault();
    game.onAnswer(true);
});


var game = {
    timerInterval: "",
    highScores: [],
    allotedTime: 120,
    questions: [["Is JavaScript case sensitive?", true], ['Is "===" type sensitive?', false], ["#3", false]], // JavaScript fundamentals questions
    currentQuestionIndex: 0,
    score: 0,
    onAnswer: function(response) {
        if (this.currentQuestionIndex == (this.questions.length - 1)) {
            this.stop();
            return;
        }
        else if (response == this.questions[this.currentQuestionIndex][1]) {
            this.score++;
        }
        this.currentQuestionIndex++;
        this.askQuestion();
    },
    setup: function() {
        responseSection.style.visibility = "hidden";
    },
    stop: function() {
        clearInterval(timerInterval);
        statusPrimary.textContent = "Game Over!";
        statusSecondary.textContent = "Score: " + this.score + "! New Game?";
        buttonStart.style.visibility = "visible";
        responseSection.style.visibility = "hidden";
    },
    askQuestion: function() {
        statusPrimary.textContent = this.questions[this.currentQuestionIndex][0];

    },
    startQuiz: function() {
        this.currentQuestionIndex = 0;
        this.askQuestion();
        
        buttonStart.style.visibility = 'hidden';
        responseSection.style.visibility = 'visible';
        
        this.startTimer();
    },
    startTimer: function() {
        var timeLeft = this.allotedTime;
        timerInterval = setInterval(function () {
            statusSecondary.textContent = timeLeft + " seconds left";
            timeLeft--;
            if (timeLeft < 0) {
                stop();
                clearInterval(timerInterval);
            }
        }, 1000);
    },
}

game.setup();


// // GIVEN I am taking a code quiz
// // WHEN I click the start button
// // THEN a timer starts and I am presented with a question
// // WHEN I answer a question
// // THEN I am presented with another question
// // WHEN I answer a question incorrectly
// // THEN time is subtracted from the clock
// // WHEN all questions are answered or the timer reaches 0
// // THEN the game is over
// // WHEN the game is over
// // THEN I can save my initials and score