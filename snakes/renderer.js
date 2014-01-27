var Renderer = {
  getCtx: function() {
    var canvas = $('#canvas')[0];
    if (canvas.getContext) {
      return canvas.getContext('2d');
    } else {
      return null;
    }
  },

  /* High-Level Drawing Functions */
  drawTitleScreen: function() {
    var ctx = Renderer.getCtx();
    ctx.font="40px sans-serif";
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillText("It's SNAKES!!!!!", width / 4, height / 2);
    ctx.font="20px sans-serif";
    ctx.fillText("Written in HTML5 Canvas", width / 4 + 30, height / 2 + 20);
    ctx.font="20px sans-serif";
    ctx.fillText("(Press Any Key To Begin)", width / 4 + 25, height / 2 + 50);
  },

  drawFrame: function() {
    var ctx = Renderer.getCtx();
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      Renderer.drawNumber(ctx);
      for (circleIndex in circles) {
        circle = circles[circleIndex];
        Renderer.drawCircle(circle, ctx);
      }
    }
  },

  drawGameOver: function(number, callback) {
    if (number > 0) {
      var ctx = Renderer.getCtx();
      Renderer.drawCircle({"x": xpos, "y": ypos, "color": getFillColor(0.3)}, 
        ctx, (7 - number) * radius * 2);
      setTimeout(function(){
        Renderer.drawGameOver(number - 1, callback);
      }, 100);
    } else {
      Renderer.drawGameOverText();
      callback();
    }
  },

  /* Functions To Draw Individual Screen Elements */
  drawGameOverText: function() {
    var ctx = Renderer.getCtx();
    ctx.rect(0,0,width,height);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();

    ctx.font="30px sans-serif";
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillText("Game Over!!!!", width / 3, height / 2);
    ctx.font="15px sans-serif";
    ctx.fillText(" (Press any key to restart)", width / 3, height / 2 + 20);
  },

  drawCircle: function(circle, ctx, size) {
    size = (typeof size === "undefined") ? radius : size;
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.fillStyle = circle["color"];
    ctx.beginPath();
    ctx.arc(circle["x"], circle["y"], size, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();
  },

  drawNumber: function(ctx) {
    ctx.font="15px sans-serif";
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillText(currentNumber["value"], currentNumber["x"], currentNumber["y"]);
  },

  drawScore: function() {
    $("#score").text("Score: " + score);
  },

  playBeep: function() {
    var snd = new Audio('beep.mp3');
    snd.play();
  },

  playBomb: function() {
    var snd = new Audio('bomb.mp3');
    snd.play();
  }
}
