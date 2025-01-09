var socket = io();

var currentScreenState;

// keep track of & store current screen <type Graphics>
var currentScreen;
var currentQuestion, currentAnswers;
var wrongAnswer, correctAnswer, leftAnswer, rightAnswer;
var gameStartTime;
var questionStartTime;
var shotClockStart;
var swappedQuestions = false;

// store screens in Graphics objects
var startScreen, endScreen;

var width;
var height;

// boolean to determine if game is currently active
var isGamePlaying;
var player1Score = 0;
var player2Score = 0;
var quiz;
var gameLength = 45;

async function loadQuiz() {
  try {
    const response = await fetch("js/quizdata.json");
    quiz = await response.json();
    randomQuestion();
  } catch (error) {
    console.log("Error:", error);
  }
}
loadQuiz();

socket.on("basket", function (msg) {
  shotMade(msg.num);
});

// this is only run once
function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);

  player1Score = 0;
  player2Score = 0;
  startScreen = createGraphics(width, height);
  //mainScreen = createGraphics(width, height);
  endScreen = createGraphics(width, height);
  currentGameState = 0;
  currentScreenState = 0;
  isGamePlaying = false;
}

function draw() {
  if (currentScreenState == 0) {
    drawStartScreen();
  }
  if (currentScreenState == 1) {
    drawMainScreen();
  }
  if (currentScreenState == 2) {
    drawEndScreen();
  }
}

function windowResized() {
  width = windowWidth;
  height = windowHeight;
  drawScreen(currentScreenState);
  resizeCanvas(windowWidth, windowHeight);
}

function changeScreenState() {
  var newState = 0;
  removeElements();
  // assign new state based on current state
  switch (currentScreenState) {
    case 0: // startScreen -> mainScreen
      newState = 1;
      isGamePlaying = true;
      break;
    case 1: // mainScreen -> endScreen
      newState = 2;
      isGamePlaying = false;
      break;
    case 2: // endScreen -> startScreen
      newState = 0;
      break;
  }
  // set currentScreenState to be next screen
  currentScreenState = newState;
  return currentScreenState;
}

function drawScreen() {
  switch (currentScreenState) {
    case 0:
      drawStartScreen();
      break;
    case 1:
      drawMainScreen();
      break;
    case 2:
      drawEndScreen();
      break;
  }
}

function drawStartScreen() {
  startScreen.background(0, 0, 0);

  startScreen.textSize(150);
  startScreen.textStyle(BOLDITALIC);
  startScreen.textFont("Times New Roman");
  startScreen.fill("yellow");
  var startText = "Quiz & Swish!";
  startScreen.text(
    startText,
    width / 2 - startScreen.textWidth(startText) / 2,
    120
  );

  startScreen.textSize(80);
  var startText = "By FTC Disaster Management 13295";
  startScreen.text(
    startText,
    width / 2 - startScreen.textWidth(startText) / 2,
    230
  );

  var startButton = createButton("GET READY!");
  startButton.position(width / 2 - 200, height / 2);
  startButton.mousePressed(startNewGame);
  image(startScreen, 0, 0);
}

function drawMainScreen() {
  background(0, 0, 0);
  fill("white");
  textFont("Courier New");
  textStyle(BOLD);

  var delta = Date.now() - gameStartTime; // milliseconds elapsed since start
  secondsElapsed = Math.floor(delta / 1000);

  // show game timer
  textSize(60);
  var minutes = Math.floor((gameLength - secondsElapsed) / 60);
  var seconds = (gameLength - secondsElapsed) % 60;
  // pad seconds if less than 10
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var timerText = minutes + ":" + seconds;
  text(timerText, width / 2 - textWidth(timerText) / 2, height / 2 + 200);
  currentTime = floor(millis() / 1000);

  // show get ready text
  textSize(40);
  fill("white");
  var getReadyText = "Get Ready! 3... ";
  if (questionStartTime + 1000 < Date.now()) getReadyText += "2... ";
  if (questionStartTime + 2000 < Date.now()) getReadyText += "1... ";
  if (questionStartTime + 3000 < Date.now()) getReadyText = "Shoot or Swap!";
  if (shotClockStart) {
    getReadyText = "";
  }
  text(getReadyText, width / 2 - textWidth(getReadyText) / 2, 160);

  // show scores
  textSize(60);
  fill("white");
  var player1ScoreText = "P1: " + player1Score;
  text(player1ScoreText, 400, height / 2 + 200);

  var player2ScoreText = "P2: " + player2Score;
  text(
    player2ScoreText,
    width - textWidth(player2ScoreText) - 400,
    height / 2 + 200
  );

  // show shot clock
  if (shotClockStart) {
    var shotTimer = Math.floor((Date.now() - shotClockStart) / 1000); // milliseconds elapsed since start
    var shotClock = 3 - shotTimer;
    textSize(40);
    fill("white");
    var shotClockText = "Answers Swapped! Shot Clock: " + shotClock;
    text(shotClockText, width / 2 - textWidth(shotClockText) / 2, 160);
  }

  // show quiz question
  textSize(50);
  fill("yellow");
  text(currentQuestion, width / 2 - textWidth(currentQuestion) / 2, 80);

  // show possible answers
  textSize(50);
  fill("yellow");
  var leftAnswerText = currentAnswers[leftAnswer];
  text(leftAnswerText, 200, height / 2);
  var rightAnswerText = currentAnswers[rightAnswer];
  text(rightAnswerText, width - textWidth(rightAnswerText) - 200, height / 2);

  // if secondsElasped is greater than gameLength, change screen to endScreen
  if (secondsElapsed >= gameLength) {
    changeScreenState();
  }
}

function drawEndScreen() {
  endScreen.background(0, 0, 0);
  endScreen.textSize(150);
  endScreen.textStyle(BOLDITALIC);
  endScreen.textFont("Times New Roman");
  endScreen.fill("yellow");

  winnerText =
    player1Score > player2Score
      ? "Game Over - Player 1 Wins!"
      : "Game Over - Player 2 Wins!";
  // show winner or tie game if scores are equal
  if (player1Score === player2Score) {
    winnerText = "Game Over - Tie Game!";
  }
  endScreen.text(
    winnerText,
    width / 2 - endScreen.textWidth(winnerText) / 2,
    120
  );

  scoreText = player1Score + " - " + player2Score;
  endScreen.textSize(80);
  endScreen.fill("white");
  endScreen.text(
    scoreText,
    width / 2 - endScreen.textWidth(scoreText) / 2,
    230
  );
  image(endScreen, 0, 0);
}

function keyPressed() {
  // if spacebar or B is pressed, start new game
  if (currentScreenState == 0) {
    if (keyCode === " ".charCodeAt(0) || keyCode === "B".charCodeAt(0))
      startNewGame();
  } else if (currentScreenState == 1) {
    // if 1 is pressed, shot is made in basket 1
    if (keyCode === "1".charCodeAt(0)) {
      shotMade(1);
    }

    // if 2 is pressed, shot is made in basket 2
    if (keyCode === "0".charCodeAt(0)) {
      shotMade(2);
    }

    // if spacebar or B is pressed, swap questions
    if (
      (keyCode === " ".charCodeAt(0) || keyCode === "B".charCodeAt(0)) &&
      !swappedQuestions &&
      Date.now() > questionStartTime + 3000
    ) {
      swappedQuestions = true;
      tempAnswer = rightAnswer;
      rightAnswer = leftAnswer;
      leftAnswer = tempAnswer;
      setTimeout(function () {
        randomQuestion();
        swappedQuestions = false;
      }, 3000);
      shotClockStart = Date.now();
    }

    // if 5 is pressed, change screen to endScreen
    if (keyCode === "5".charCodeAt(0)) {
      changeScreenState();
    }
  } else if (currentScreenState == 2) {
    // if spacebar or B is pressed, change screen to startScreen
    if (keyCode === " ".charCodeAt(0) || keyCode === "B".charCodeAt(0)) {
      changeScreenState();
    }
  }
}

function startNewGame() {
  changeScreenState();
  player1Score = 0;
  player2Score = 0;
  gameStartTime = Date.now();
  randomQuestion();
}

function shotMade(basket) {
  if (!isGamePlaying) return;
  if (Date.now() < questionStartTime + 3000) return;
  if (basket == 1) {
    if (leftAnswer == correctAnswer) {
      player1Score += 2;
      randomQuestion();
    }
    // else {
    //   if (swappedQuestions) {
    //     player2Score += 1;
    //     randomQuestion();
    //   }
    // }
  } else if (basket == 2) {
    if (rightAnswer == correctAnswer) {
      player2Score += 2;
      randomQuestion();
    }
    // else {
    //   if (swappedQuestions) {
    //     player1Score += 1;
    //     randomQuestion();
    //   }
    // }
  }
}

function randomQuestion() {
  questionStartTime = Date.now();
  var questions = quiz["robotics"]["questions"];
  shotClockStart = null;
  var questionAnswerPair =
    questions[Math.floor(Math.random() * questions.length)];
  currentQuestion = questionAnswerPair.question;
  currentAnswers = questionAnswerPair.answers;
  correctAnswer = 0;
  wrongAnswer = Math.floor(Math.random() * (currentAnswers.length - 1)) + 1;
  if (Math.random() < 0.5) {
    leftAnswer = correctAnswer;
    rightAnswer = wrongAnswer;
  } else {
    leftAnswer = wrongAnswer;
    rightAnswer = correctAnswer;
  }
}

function startGameTimer() {
  setInterval(function () {
    drawScreen(currentScreenState);
  }, 100);
}


startGameTimer();
