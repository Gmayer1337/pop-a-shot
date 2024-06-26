var socket = io();

// keep track of what screen the game is on <type int>
// states: start = 0; main = 1; end = 2; 
var currentScreenState, nextScreenState;

// keep track of & store current screen <type Graphics>
var currentScreen;

// store screens in Graphics objects
var startScreen, mainScreen, endScreen;
var startButton;

var width;
var height;

// boolean to determine if game is currently active
var isGamePlaying;
var score = 0;
var quiz;

async function loadQuiz() {
  try {
    const response = await fetch('js/quizdata.json');
    quiz = await response.json();
  } catch (error) {
    console.log('Error:', error);
  }
}
loadQuiz();

socket.on('score', function (msg) {
  score = score + msg.points;
});

function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);

  score = 0;
  startScreen = createGraphics(width, height);
  mainScreen = createGraphics(width, height);
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
  //resizeCanvas(windowWidth, windowHeight);
}

function changeScreenState(currentState) {
  var newState = 0;
  // assign new state based on current state
  switch (currentState) {
    case 0:  // startScreen -> mainScreen
      newState = 1;
      isGamePlaying = true;
      break;
    case 1:  // mainScreen -> endScreen
      newState = 2;
      isGamePlaying = false;
      break;
    case 2:  // endScreen -> startScreen
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
      drawStartScreen(); break;
    case 1:
      drawMainScreen(); break;
    case 2:
      drawEndScreen(); break;
  }
}

function drawStartScreen() {
  startScreen.background(100);
  startButton = createButton("start");
  startButton.position(width / 2, height / 5 * 4);
  startButton.style("font-family:monospace; font-weight:bold; font-size:24px; padding:10px; border-radius:10px;");
  startButton.mousePressed(startButtonClicked);
  image(startScreen, 0, 0);
}

function drawMainScreen() {
  mainScreen.background(237, 178, 90);
  mainScreen.textSize(40);
  mainScreen.textFont('Courier New');
  mainScreen.text("Time Passed", 20, 40);
  currentTime = floor(millis() / 1000);
  mainScreen.text(currentTime, 20, 80);

  mainScreen.text("Score", 500, 40);
  mainScreen.text(score, 500, 80);

  //setting up a "winning" condition
  if (score > 2) {
    mainScreen.push();
    mainScreen.textSize(80);
    mainScreen.fill('red');
    mainScreen.text("YOU WIN", 20, 200);
    mainScreen.pop();
    changeScreenState(1);
    score = 0;
  }
  image(mainScreen, 0, 0);
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
  if (keyCode === UP_ARROW && currentScreenState == 1) {
    score++;
  }
  if (keyCode === UP_ARROW && currentScreenState == 2) {
    changeScreenState(2);
  }
}