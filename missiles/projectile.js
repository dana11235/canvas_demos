function Projectile(targetX, targetY, startX, startY) {
  this.targetX = targetX;
  this.targetY = targetY;
  this.startX = startX;
  this.startY = startY;
  this.height = height;
  this.currentpos = 0;
  this.exploding = false;
  this.totaldistance = Math.sqrt(Math.pow(targetY - startY, 2) + 
    Math.pow(targetX - startX, 2))
}

Projectile.prototype.advance = function() {
  if (!this.exploding) {
    // Anti-missiles travel faster than missiles
    this.currentpos += 5;
    if (this.currentpos >= this.totaldistance) {
      this.exploding = true;
      this.exploding_frames = 15;
    }
  } else {
    this.destroy_missiles();
    this.exploding_frames--;
    if (this.exploding_frames == 0) {
      this.remove();
    }
  }
}

Projectile.prototype.getCoordinates = function() {
  var fraction = this.currentpos / this.totaldistance;
  var ypos = this.startY + Math.round((this.targetY - this.startY) * fraction);
  var xpos = this.startX + Math.round((this.targetX - this.startX) * fraction);
  return {begin: [this.startX, this.startY], current: [xpos, ypos]};
}

Projectile.prototype.getSize = function() {
  return 5 + 2 * (15 - this.exploding_frames);
}

Projectile.prototype.remove = function() {
  projectiles.splice(projectiles.indexOf(this),1);
}

Projectile.prototype.destroy_missiles = function() {
  for (missileIndex in missiles) {
    var missile = missiles[missileIndex];
    var coord = missile.getCoordinates();
    if (Math.sqrt(
        Math.pow(coord['current'][0] - this.targetX, 2) + 
        Math.pow(coord['current'][1] - this.targetY, 2)) < this.getSize()) {
      window.score += 10;
      missiles.splice(missiles.indexOf(missile),1);
    }
  }
}

Projectile.colors = [
 'rgba(255,0,0,1)', 
 'rgba(255,127,0,1)', 
 'rgba(255,255,0,1)', 
 'rgba(0,255,0,1)', 
 'rgba(0,0,255,1)', 
 'rgba(75,0,130,1)', 
 'rgba(143,0,255,1)', 
 'rgba(0,0,0,1)' 
];

Projectile.prototype.getColor = function(){
  var next_color = Projectile.colors[(15 - this.exploding_frames) % Projectile.colors.length];
  return next_color;
}

