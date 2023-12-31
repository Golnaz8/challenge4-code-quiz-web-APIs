var wrapperEl = document.querySelector("#wrapper");
var navEl = document.querySelector(".nav");
var startEl = document.querySelector("#start");
var mainEl = document.querySelector(".main");
var timerEl = document.querySelector("#timer");
var buttonEl = document.querySelector("#button-container");
var quesEl = document.querySelector("#ques");
var chOneEl =document.querySelector("#choice-one");
var chTwoEl = document.querySelector("#choice-two");
var chThreeEl = document.querySelector("#choice-three");
var chFourEl = document.querySelector("#choice-four");
var alertEl = document.querySelector("#alert");
var doneEl = document.querySelector("#done-page");
var scoreEl = document.querySelector("#user-score");
var submitEl = document.querySelector("#submit");
var addScoreEl = document.querySelector("#add-score");
var backBtnEl = document.querySelector("#back-btn");
var clearBtnEl = document.querySelector("#clear-btn");
var styleEl = document.querySelector(".style");
userInitialEl = document.querySelector("#user-initial");
scoresLinkEl = document.querySelector("#scores-link");


var score = 0;
var secondsLeft = 75;
var num = 0;


var questions = [
    {
        question: "Which of the following is NOT a valid CSS selector?",
        tests: [".class-selector", "#id-selector", "<element>-selector", "[attribute]-selector"],
        answer: chFourEl
    },
    {
        question: "Which CSS property is used to make a background image fixed so that it doesn't scroll with the rest of the page?",
        tests: ["background-attachment", "background-image", "background-position", "background-repeat"],
        answer: chOneEl
    },
    {
        question: "In HTML, which tag is used to define a hyperlink?",
        tests: ["<a>", "<p>", "<div>", "<h1>"],
        answer: chOneEl
    },
    {
        question: "Which CSS property is used to control the spacing between the content and the border of an element?",
        tests: ["margin", "padding", "border-spacing", "outline"],
        answer: chTwoEl
    },
    {
        question: "Which of the following is NOT a valid JavaScript comparison operator?",
        tests: ["===", "==", "><", "<"],
        answer: chThreeEl 
    }

]

//each time display one object of the questions array 
function makeQuestions(number) {
    buttonEl.setAttribute("style", "display: block;")
    quesEl.textContent = `${number+1} ) ${questions[number].question}`;
    quesEl.setAttribute("style", "display: inline-block;text-align: center; margin-top:15%; margin-left: 25%;");
    chOneEl.textContent = `A) ${questions[number].tests[0]}`;
    chTwoEl.textContent = `B) ${questions[number].tests[1]}`;
    chThreeEl.textContent = `C) ${questions[number].tests[2]}`;
    chFourEl.textContent = `D) ${questions[number].tests[3]}`;
}

//each answer button is clicked, it checks with the right answer  
buttonEl.addEventListener("click", (event)=> {
    var answerChoice = event.target;
    if (answerChoice.matches("button")) {
        console.log(answerChoice);
    }else {
        return;
    }
        
    if (answerChoice === questions[num].answer){
        correctAnswer();
        return;
    }
    if (answerChoice !== questions[num].answer ){
        incorrectAnswer();
        return;
    }
});
 
//if user click on right answer, it scores and goes to next question
function correctAnswer() {
    alertTimerC();
    score += 5;
    nextQuestion();
    return score;
}

//for correct answer, it displays Correct for one second
function alertTimerC() {
    alertEl.textContent = "Correct";
    alertEl.setAttribute("style", "color: green;");
    setTimeout(function() {
        alertEl.setAttribute("style", "display: none;");
      }, 1000);
}

//if user click on wrong answer, it subtracts 15 seconds and goes to next question
function incorrectAnswer() {
    alertTimerI();
    var penaltyTime = 15;
    if (secondsLeft>15) {
        secondsLeft -= penaltyTime;
    }else {
        endOfQuiz();
    }
    
    nextQuestion();
    timerEl.innerText = `${secondsLeft} seconds left`;
}

//for wrong answer, it displays Incorrect for one second
function alertTimerI() {
    alertEl.textContent = "Incorrect"
    alertEl.setAttribute("style", "color: red;");
    setTimeout(function() {
        alertEl.setAttribute("style", "display: none;");
      }, 1000);
}

//this function displays first question and start the timer
function firstQ(){
    mainEl.setAttribute("style", "display: none;");
    setTime();
    makeQuestions(num);
}

//if still we have questions, it calls makeQuestions to display next question
function nextQuestion() {
    num = num +1;
    if (num > questions.length-1){
        endOfQuiz();
    }else{
        makeQuestions(num);
    }
}

//when the time is over or all questions are displayed, it shows the score page and ask for initials
function endOfQuiz() {
    buttonEl.setAttribute("style", "display: none;");
    doneEl.setAttribute("style", "display: inline-block;");
    scoreEl.textContent= `Your final score is: ${score}.`;
    timerEl.innerText = `0 seconds left`;
    secondsLeft= 0;
}

//uses local storage to save the result and sort them
function saveResult(userInitial,userScore) {
    var existingValues = JSON.parse(localStorage.getItem('allScores')) || [];
    existingValues.push({userInitial,userScore});
    existingValues.sort((a, b) => b.userScore - a.userScore);
    console.log(existingValues);
    localStorage.setItem('allScores', JSON.stringify(existingValues));
}

//displays five higher score. uses local storage to save and sort
function fiveHighScores(userInitial,userScore){
    clearHighScoresPage();
    var fiveLastHighScores = JSON.parse(localStorage.getItem('highScores')) || [];
    fiveLastHighScores.push({userInitial,userScore});
    fiveLastHighScores.sort((a, b) => b.userScore - a.userScore);
    if (fiveLastHighScores.length>5) {
    var slicedHigh= fiveLastHighScores.slice(0 , 5);
    localStorage.setItem('highScores', JSON.stringify(slicedHigh));
    console.log(slicedHigh);

    //create li elements to display initials and scores
    for (i=0; i<5; i++) {
        var liEl = document.createElement("li");
        liEl.textContent = slicedHigh[i].userInitial +" : "+ slicedHigh[i].userScore;
        addScoreEl.appendChild(liEl);
    }
    }else{
        localStorage.setItem('highScores', JSON.stringify(fiveLastHighScores));

        for (i=0; i<fiveLastHighScores.length; i++){
            var liEl = document.createElement("li");
            liEl.textContent = fiveLastHighScores[i].userInitial +" : "+ fiveLastHighScores[i].userScore;
            addScoreEl.appendChild(liEl);
        }
    }
}

//set the timer and displays how many seconds left
function setTime() {
    var timerInterval = setInterval(function() {
      secondsLeft--;
      timerEl.textContent = `${secondsLeft} seconds left`;
      timerEl.setAttribute("style", "float: right;");
      
      //it checks if the time is over or all questions are displayed, calls endOfQuiz function and stop the timer
      if(secondsLeft === 0 || num > questions.length-1) {
        endOfQuiz();
        clearInterval(timerInterval);
      }
      if (secondsLeft < 0) {
        endOfQuiz();
        secondsLeft = 0;
        timerEl.innerText = `0 seconds left`;
        clearInterval(timerInterval);
      }
    }, 1000);
}

//submits score and initials. calls other functions to save result and show upto five higher scores.
var submitScore = function(event) {
    event.preventDefault();


    var quizResult=
    {
        userInitial: document.querySelector("#user-initial").value,
        userScore: score
    }

  
    if (quizResult.userInitial === "") {
      window.alert("Please enter initials before submit.");
      submitScore();
    } else {
       saveResult(quizResult.userInitial,quizResult.userScore);
       fiveHighScores(quizResult.userInitial,quizResult.userScore);
    }
    userInitialEl.value = "";
    quizResult.userScore = 0;
    highScoresPage();
}

//displays higher scores page
function highScoresPage() {
    wrapperEl.setAttribute("style", "display: none;");
    doneEl.setAttribute("style", "display: none;");
    styleEl.setAttribute("style", "display: block;");
}

//resets score and timer, hides current page and displays main first page
function goBack() {
    styleEl.setAttribute("style", "display: none;");
    wrapperEl.setAttribute("style", "display: block;");
    mainEl.setAttribute("style", "display: inline-block;");
    num = 0;
    score = 0;
    secondsLeft = 75;
    timerEl.textContent= `Timer`;
}

//this function clears all li elements which are children of addScoreEl
function clearHighScoresPage() {
    var childNodes = addScoreEl.childNodes;

    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        addScoreEl.removeChild(childNode);
    }
}

//event listeners
startEl.addEventListener("click",firstQ);
submitEl.addEventListener("click",submitScore); 
backBtnEl.addEventListener("click",goBack);
scoresLinkEl.addEventListener("click", highScoresPage);
clearBtnEl.addEventListener("click", clearHighScoresPage)

