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
    ctx.fillText("It's Missiles!!!!!", width / 4, height / 2);
    ctx.font="20px sans-serif";
    ctx.fillText("Written in HTML5 Canvas", width / 4 + 30, height / 2 + 20);
    ctx.font="20px sans-serif";
    ctx.fillText("(Press Any Key To Begin)", width / 4 + 25, height / 2 + 50);
  },

  drawFrame: function() {
    var ctx = Renderer.getCtx();
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      Renderer.drawCities(ctx);
      Renderer.drawGun(ctx);
      Renderer.drawMissiles(ctx);
      Renderer.drawProjectiles(ctx);
    }
    Renderer.drawScore();
  },

  drawGameOver: function(callback) {
    Renderer.drawGameOverText();
    callback();
  },

  /* Functions To Draw Individual Screen Elements */
  drawGameOverText: function() {
    var ctx = Renderer.getCtx();
    ctx.rect(0,0,width,height);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();

    ctx.font="30px sans-serif";
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillText("THE END!!!!", width / 3, height / 2);
    ctx.font="15px sans-serif";
    ctx.fillText(" (Press any key to restart)", width / 3, height / 2 + 20);
  },

  drawMissiles: function(ctx) {
    for (missileIndex in missiles) {
      var missile = missiles[missileIndex];
      Renderer.drawMissile(ctx, missile);
    }
  },

  drawMissile: function(ctx, missile) {
    ctx.beginPath();
    var coord = missile.getCoordinates();
    ctx.strokeStyle = "rgba(0,0,0,1)";//missile.getColor();
    ctx.moveTo(coord['begin'][0], coord['begin'][1]);
    ctx.lineTo(coord['current'][0], coord['current'][1]);
    ctx.stroke();
    if (missile.exploding) {
      Renderer.drawExplosion(ctx, missile);
    }
  },

  drawExplosion: function(ctx, missile) {
    var radius = size = (typeof size === "undefined") ? radius : size;
    ctx.fillStyle = missile.getColor();
    ctx.beginPath();
    var coord = missile.getCoordinates();
    ctx.arc(coord["current"][0], coord["current"][1], 
      missile.getSize(), 0, 2*Math.PI);
    ctx.fill();
  },

  drawProjectiles: function(ctx) {
    for (projectileIndex in projectiles) {
      var projectile = projectiles[projectileIndex];
      Renderer.drawProjectile(ctx, projectile);
    }
  },

  drawProjectile: function(ctx, projectile) {
    ctx.beginPath();
    var coord = projectile.getCoordinates();
    ctx.strokeStyle = "blue";
    ctx.moveTo(coord['begin'][0], coord['begin'][1]);
    ctx.lineTo(coord['current'][0], coord['current'][1]);
    ctx.stroke();
    if (projectile.exploding) {
      Renderer.drawExplosion(ctx, projectile);
    }
  },


  drawGun: function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(width/2 + 20, height, 30, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(width/2 + 15, height - 40, 10, 40);
    ctx.fill();
  },

  drawCities: function(ctx) {
    for (cityIndex in cities){
      city = cities[cityIndex];
      Renderer.drawCity(ctx, city);
    }
  },

  drawCity: function(ctx, pos) {
    ctx.drawImage($("#city")[0], pos, height-15)
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
