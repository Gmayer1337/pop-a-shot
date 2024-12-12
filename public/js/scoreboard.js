var socket = io();

// keep track of what screen the game is on <type int>
// states: start = 0; main = 1; end = 2;
var currentScreenState, nextScreenState;

// keep track of & store current screen <type Graphics>
var currentScreen;
var currentQuestion, currentAnswers;
var leftAnswer, rightAnswer;

// store screens in Graphics objects
var startScreen, endScreen;
var startButton;

var width;
var height;

// boolean to determine if game is currently active
var isGamePlaying;
var player1Score = 0;
var player2Score = 0;
var quiz;

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

// socket.on("score", function (msg) {
//   score = score + msg.points;
// });

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

function changeScreenState(currentState) {
  var newState = 0;
  // assign new state based on current state
  switch (currentState) {
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

function drawScreen(screenState) {
  switch (screenState) {
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
  startScreen.background(100);
  startButton = createButton("start");
  startButton.position(width / 2, (height / 5) * 4);
  startButton.style(
    "font-family:monospace; font-weight:bold; font-size:24px; padding:10px; border-radius:10px;"
  );
  startButton.mousePressed(startButtonClicked);
  image(startScreen, 0, 0);
}

function drawMainScreen() {
  background(237, 178, 90);
  textSize(40);
  textFont("Courier New");
  // text("Time Passed", 20, 40);
  // currentTime = floor(millis() / 1000);
  // text(currentTime, 20, 80);
  textSize(200);
  text(currentQuestion, 350, 400);
  text(currentAnswers[leftAnswer], 0, 1000);
  text(currentAnswers[rightAnswer], 1500, 1000);
  
  textSize(90);
  text("Player 1:", 50, 80);
  text(player1Score, 550, 80);

  text("Player 2:", 1250, 80);
  text(player2Score, 1750, 80);


  //setting up a "winning" condition
  if (score > 9) {
    push();
    textSize(80);
    fill("red");
    text("YOU WIN", 20, 200);
    pop();
    changeScreenState(1);
    score = 0;
  }
}

function drawEndScreen() {
  var message = "YOU WIN";
  endScreen.background(0);
  endScreen.fill(255);
  endScreen.textSize(100);
  endScreen.textStyle(BOLD);
  endScreen.textAlign(CENTER);
  endScreen.text(message, width / 2, (height + 200) / 2);
  image(endScreen, 0, 0);
}

// remove button element from DOM
// change currentScreenState from 0 -> 1
function startButtonClicked() {
  removeElements();
  changeScreenState(0);
}

function keyPressed() {
  if (keyCode === UP_ARROW && currentScreenState == 0) {
    startButtonClicked();
  }
  if (currentScreenState == 1) {
    if (keyCode === "1".charCodeAt(0) || keyCode === "9".charCodeAt(0)) {
      if (leftAnswer == 0) {
        player1Score += 2;
      }
      randomQuestion();
      drawMainScreen();
    }

    if (keyCode === "2".charCodeAt(0) || keyCode === "0".charCodeAt(0)) {
      if (rightAnswer == 0) {
        player2Score += 2;
      }

      randomQuestion();
      drawMainScreen();
    }
  }

  // if (keyCode === UP_ARROW && currentScreenState == 1) {
  //   score++;
  // }
  if (keyCode === UP_ARROW && currentScreenState == 2) {
    changeScreenState(2);
  }
}

function randomQuestion() {
  var questions = quiz["math"]["questions"];
  var questionAnswerPair =
    questions[Math.floor(Math.random() * questions.length)];
  currentQuestion = questionAnswerPair.question;
  currentAnswers = questionAnswerPair.answers;
  leftAnswer = Math.floor(Math.random() * 2);
  rightAnswer = leftAnswer == 0 ? 1 : 0;
}

// function startGameTimer() {
//   var start = Date.now();
//   setInterval(function() {
//       var delta = Date.now() - start; // milliseconds elapsed since start
//       output(Math.floor(delta / 1000)); // in seconds
//       // alternatively just show wall clock time:
//       output(new Date().toUTCString());
//   }, 1000); // update about every second
// }

// write a timer that assigns currentQuestion every 3 seconds
// use setTimeout()
// setInterval(function () {
//   if (isGamePlaying) {
//     randomQuestion();
//   }
// }, 30000);
