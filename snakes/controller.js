var Controller = {

  /* High-Level Control Functions */
  initialize: function(width, height) {
    var canvas = $("#canvas");
    canvas.attr("width", width);
    canvas.attr("height", height);
    window.width = width;
    window.height = height;
    $(document).on('keypress.any', Controller.keyPressHandlers.any);
    Renderer.drawTitleScreen();
  },

  startGame: function() {
    window.eventLoop = setInterval(Controller.runEventLoop, 30);
    currentNumber = null;
    Controller.setCurrentNumber();

    // Reset some variables
    score = 0;
    Renderer.drawScore();
    circles = [];
    maxCircles = 20;
    currentControl = "right";
    xpos = radius + 50;
    ypos = radius + 50;

    $(document).off('keypress.any');
    $(document).on('keypress.wasd', Controller.keyPressHandlers.wasd);
  },

  endGame: function() {
    $(document).off('keypress.wasd');
    clearInterval(eventLoop);
    Renderer.drawGameOver(6, Controller.resetGame);
  },

  resetGame: function() {
    $(document).on('keypress.any', Controller.keyPressHandlers.any);
  },

  runEventLoop: function() {
    Controller.moveSnake();
    Controller.updateColor();
    Controller.addCircle();
    if (Controller.collisionDetectors.death()) {
      Controller.endGame();
    } else {
      Controller.collisionDetectors.number();
      Renderer.drawFrame();
    }
  },


  /* Functions For Updating the Snake Position, Color, and Number */
  moveSnake: function(){
    xpos += controls[currentControl]["x"]
    ypos += controls[currentControl]["y"]
  },

  setCurrentNumber: function() {
    ctx = Renderer.getCtx();
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
  },

  updateColor: function() {
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
  },

  addCircle: function() {
    var color = getFillColor();
    var currentx = xpos;
    var currenty = ypos;
    circles.push({
      "color": color,
      "x": xpos,
      "y": ypos});
    if (circles.length > maxCircles) {circles.shift();}
  },

  /* Keypress Handlers */
  keyPressHandlers: {
    any: function(evt) {
      Controller.startGame();
      evt.preventDefault();
    },

    wasd: function(evt) {
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
