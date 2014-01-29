var Controller = {

  /* High-Level Control Functions */
  initialize: function(width, height) {
    var canvas = $("#canvas");
    canvas.attr("width", width);
    canvas.attr("height", height);
    window.width = width;
    window.height = height;
    $(document).on('keypress.start', Controller.keyPressHandlers.start);
    Renderer.drawTitleScreen();
  },

  startGame: function() {
    window.eventLoop = setInterval(Controller.runEventLoop, 30);
    window.missileGeneratorLoop =
      setInterval(Controller.runMissileGeneratorLoop, 500);

    // Reset some variables
    score = 0;
    Renderer.drawScore();
    missiles = [];
    cities = [];
    Controller.setupCities();

    $(document).off('keypress.start');
    $(document).on('keypress.controls', Controller.keyPressHandlers.wasd);
  },

  endGame: function() {
    $(document).off('keypress.wasd');
    clearInterval(eventLoop);
    Renderer.drawGameOver(Controller.resetGame);
  },

  resetGame: function() {
    $(document).on('keypress.any', Controller.keyPressHandlers.start);
  },

  runMissileGeneratorLoop: function() {
    if (Math.floor(Math.random() * 4) + 1 == 1) {
      Controller.addMissile();
    }
  },

  runEventLoop: function() {
    for (missileIndex in missiles) {
      var missile = missiles[missileIndex];
      missile.advance();
    }
    Renderer.drawFrame();
    if (cities.length == 0) {
      Controller.endGame();
    }
  },

  /* Functions to operate on missiles */
  addMissile: function() {
    missiles.push(new Missile(width, height));
  },

  /* Functions to operate on cities */
  setupCities: function() {
    segment_width = width / 8;
    for(i = 1; i < 8; i++) {
      if (i != 4) {
        cities.push(segment_width * i);
      }
    }
  },

  /* Keypress Handlers */
  keyPressHandlers: {
    start: function(evt) {
      Controller.startGame();
      evt.preventDefault();
    },

    controls: function(evt) {
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
  },

  /* Detect collision with a number or the wall */
  collisionDetectors: {
    number: function() {
      if (xpos >= currentNumber["x"] &&
          xpos <= currentNumber["x"] + currentNumber["width"] &&
          ypos >= currentNumber["y"] - currentNumber["height"] &&
          ypos <= currentNumber["y"]) {
        score += currentNumber["value"];
        Renderer.playBeep();
        Renderer.drawScore();
        Controller.setCurrentNumber();
        maxCircles += circleIncrement;
      }
    },

    death: function(){
      // Check for a collision with a wall
      if ((xpos + radius > width) || (xpos - radius < 0) ||
          (ypos + radius > height) || (ypos - radius < 0)) {
        Renderer.playBomb();
        return true;
      // See whether the snake collided with itself
      } else {
        for (circleIndex in circles.slice(1)) {
          circle = circles[circleIndex]
          if (xpos == circle["x"] && ypos == circle["y"]) {
            Renderer.playBomb();
            return true;
          }
        }
      }
      return false;
    }
  }
}
