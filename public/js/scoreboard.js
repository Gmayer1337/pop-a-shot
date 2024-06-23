var score = 0;

var socket = io();

socket.on('score', function(msg) {
  score = score + msg.points;
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  score = 0;
}

function preload() {
  font = loadFont('/js/2player.woff2');
}

function draw() {
  background(237, 178, 90)

  textSize(40);
  textFont('Courier New');
  text("Time Passed", 20, 40);
  currentTime = floor(millis()/1000);
  text(currentTime, 20, 80);
  
  text("Score", 500, 40);
  text(score, 500, 80);
  
  //setting up a "winning" condition
  if (score > 10){
    push();
      textSize(80);
      fill('red');
      text("YOU WIN", 20, 200);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed(){
  if (keyCode === UP_ARROW){
    score++; 
  }
}
