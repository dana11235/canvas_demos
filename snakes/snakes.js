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

function runSnakes() {
  Controller.initialize(640,480);
}

// Utility function to get the current fill color
function getFillColor(alpha) {
  alpha = (typeof alpha === "undefined") ? 1 : alpha;
  return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
}
