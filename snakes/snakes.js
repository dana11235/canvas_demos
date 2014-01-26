/* Variables */
var red = 255;
var green = 0;
var blue = 0;
var colorStepIndex = 0;

var xpos = -1; 
var ypos = -1;
var width = -1;
var height = -1;
var maxCircles = -1;
var circles = null;
var currentControl = null;
var currentNumber = null;
var score = -1;

/* Constants */
var circleIncrement = 10;
var radius = 5;

var controls = {
  "left": {"x": -5, "y": 0},
  "right": {"x": 5, "y": 0},
  "up": {"x": 0, "y": -5},
  "down": {"x": 0, "y": 5}
}

var colorSteps = [
  {"r": 0, "g": 2, "b": 0},
  {"r": -10, "g": 0, "b": 0},
  {"r": 0, "g": -10, "b": 10},
  {"r": 10, "g": 0, "b": 0},
  {"r": 0, "g": 0, "b": -10}
];

function initialize(width, height) {
  var canvas = $("#canvas");
  canvas.attr("width", width);
  canvas.attr("height", height);
  window.width = width;
  window.height = height;
  $(document).on('keypress.any', anyKeypressHandler);
  renderTitleScreen();
}

function renderTitleScreen() {
  var ctx = getCtx();
  ctx.font="40px sans-serif";
  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillText("It's SNAKES!!!!!", width / 4, height / 2);
  ctx.font="20px sans-serif";
  ctx.fillText("Written in HTML5 Canvas", width / 4 + 30, height / 2 + 20);
  ctx.font="20px sans-serif";
  ctx.fillText("(Press Any Key To Begin)", width / 4 + 25, height / 2 + 50);
}

function start() {
  window.eventLoop = setInterval(runEventLoop, 30);
  currentNumber = null;
  setCurrentNumber();

  // Reset some variables
  score = 0;
  renderScore();
  circles = [];
  maxCircles = 20;
  currentControl = "right";
  xpos = radius + 50;
  ypos = radius + 50;

  $(document).off('keypress.any');
  $(document).on('keypress.wasd', wasdKeypressHandler);
}

function runEventLoop() {
  moveSnake();
  updateColor();
  addCircle();
  if (checkCollision()) {
    endGame();
  } else {
    detectNumberCollected();
    render();
  }
}

function wasdKeypressHandler(evt){
  if (evt.which == 119) {
    currentControl = "up";
  } else if  (evt.which == 97) {
    currentControl = "left";
  } else if  (evt.which == 115) {
    currentControl = "down";
  } else if  (evt.which == 100) {
    currentControl = "right";
  }
  evt.preventDefault();
}

function anyKeypressHandler(evt){
  start();
  evt.preventDefault();
}

function detectNumberCollected() {
  if (xpos >= currentNumber["x"] &&
      xpos <= currentNumber["x"] + currentNumber["width"] &&
      ypos >= currentNumber["y"] - currentNumber["height"] &&
      ypos <= currentNumber["y"]) {
  //if (Math.abs(xpos - currentNumber["x"]) < 15 &&
  //   Math.abs(ypos - currentNumber["y"]) < 15) {
    score += currentNumber["value"];
    renderScore();
    setCurrentNumber();
    maxCircles += circleIncrement;
  }
}

function renderScore() {
  $("#score").text("Score: " + score);
}

function endGame() {
  $(document).off('keypress.wasd');
  clearInterval(eventLoop);
  renderGameOver(6);
}

function renderGameOver(number) {
  if (number > 0) {
    var ctx = getCtx();
    drawCircle({"x": xpos, "y": ypos, "color": getFillColor(0.3)}, 
      ctx, (7 - number) * radius * 2);
    setTimeout(function(){
      renderGameOver(number - 1);
    }, 100);
  } else {
    renderGameOverText();
    resetGame();
  }
}

function resetGame() {
  $(document).on('keypress.any', anyKeypressHandler);
}

function renderGameOverText() {
  var ctx = getCtx();
  ctx.rect(0,0,width,height);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fill();

  ctx.font="30px sans-serif";
  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillText("Game Over!!!!", width / 3, height / 2);
  ctx.font="15px sans-serif";
  ctx.fillText(" (Press any key to restart)", width / 3, height / 2 + 20);
}

function setCurrentNumber() {
  ctx = getCtx();
  ctx.font="15px sans-serif";
  newValue =  (currentNumber === null) ? 1 : currentNumber["value"] + 1;
  currentNumber = {
    "value": newValue,
    "x": (Math.floor(Math.random() * (width / 5 - 4)) + 2) * 5,
    "y": (Math.floor(Math.random() * (height / 5 - 4)) + 2) * 5,
    // We have to measure the number for accurate collision detection
    "height": 15,
    "width": ctx.measureText(newValue).width
  }
}

function moveSnake(){
  xpos += controls[currentControl]["x"]
  ypos += controls[currentControl]["y"]
}

function checkCollision(){
  // Check for a collision with a wall
  if ((xpos + radius > width) || (xpos - radius < 0) ||
      (ypos + radius > height) || (ypos - radius < 0)) {
    return true;
  // See whether the snake collided with itself
  } else {
    for (circleIndex in circles.slice(1)) {
      circle = circles[circleIndex]
      if (xpos == circle["x"] && ypos == circle["y"]) {
        return true;
      }
    }
  }
  return false;
}

function updateColor() {
  if (red <= 255 && red >= 0 &&
      blue <= 255 && blue >= 0 &&
      green <= 255 && green >= 0) {
    colorStep = colorSteps[colorStepIndex % 5];
    red += colorStep["r"];
    green += colorStep["g"];
    blue += colorStep["b"];
  } else {
    red -= colorStep["r"];
    green -= colorStep["g"];
    blue -= colorStep["b"];
    colorStepIndex += 1;
  }
}

function addCircle() {
  var color = getFillColor();
  var currentx = xpos;
  var currenty = ypos;
  circles.push({
    "color": color,
    "x": xpos,
    "y": ypos});
  if (circles.length > maxCircles) {circles.shift();}
}

function drawCircle(circle, ctx, size) {
  size = (typeof size === "undefined") ? radius : size;
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.fillStyle = circle["color"];
  ctx.beginPath();
  ctx.arc(circle["x"], circle["y"], size, 0, 2*Math.PI);
  ctx.stroke();
  ctx.fill();
}

function drawNumber(ctx) {
  ctx.font="15px sans-serif";
  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillText(currentNumber["value"], currentNumber["x"], currentNumber["y"]);
}

function render() {
  var ctx = getCtx();
  if (ctx) {
    ctx.clearRect(0, 0, width, height);
    drawNumber(ctx);
    for (circleIndex in circles) {
      circle = circles[circleIndex];
      drawCircle(circle, ctx);
    }
  }
}

function getCtx() {
  var canvas = $('#canvas')[0];
  if (canvas.getContext) {
    return canvas.getContext('2d');
  } else {
    return null;
  }
}

function getFillColor(alpha) {
  alpha = (typeof alpha === "undefined") ? 1 : alpha;
  return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
}
