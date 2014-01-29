function Missile(width, height) {
  this.width = width;
  this.height = height;
  this.startpos = Math.floor(Math.random() * width) + 1;
  this.endpos = Math.floor(Math.random() * width) + 1;
  this.currentpos = 0;
  this.exploding = false;
  this.totaldistance = Math.sqrt(Math.pow(height, 2) + 
    Math.pow(this.startpos - this.endpos, 2))
}
Missile.prototype.advance = function() {
  if (!this.exploding) {
    this.currentpos += 2;
    if (this.currentpos >= this.totaldistance) {
      this.exploding = true;
      this.exploding_frames = 15;
    }
  } else {
    this.exploding_frames--;
    if (this.exploding_frames == 0) {
      // Determine if it collided with cities, and then remove it
      this.explode();
    }
  }
}
Missile.prototype.getCoordinates = function() {
  var fraction = this.currentpos / this.totaldistance;
  var ypos = Math.round(this.height * fraction);
  var xpos = this.startpos + 
    Math.round((this.endpos - this.startpos) * fraction);
  return {begin: [this.startpos, 0], current: [xpos, ypos]};
}

Missile.prototype.explode = function() {
  for (cityIndex in cities) {
    city = cities[cityIndex];
    if (this.endpos + Missile.explosionRadius > city && 
        this.endpos - Missile.explosionRadius < city + 40) {
      cities.splice(cityIndex,1);
      Renderer.playBomb();
    }
  }

  // Remove this missile
  missiles.splice(missiles.indexOf(this),1);
}

Missile.prototype.getSize = function() {
  return Missile.explosionRadius;
}

Missile.explosionRadius = 15;

Missile.colors = [
 'rgba(255,0,0,1)', 
 'rgba(255,127,0,1)', 
 'rgba(255,255,0,1)', 
 'rgba(0,255,0,1)', 
 'rgba(0,0,255,1)', 
 'rgba(75,0,130,1)', 
 'rgba(143,0,255,1)', 
 'rgba(0,0,0,1)' 
];

Missile.prototype.getColor = function(){
  var next_color = Missile.colors[(15 - this.exploding_frames) % Missile.colors.length];
  return next_color;
}

