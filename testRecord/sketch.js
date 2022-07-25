P5Capture.setDefaultOptions({
  format: "mp4",
  framerate: 60,
  quality: 0.5,
  width: 720,
  height: 480
});

let system;


function setup() {
  createCanvas(720, 480);
  system = new ParticleSystem(createVector(width / 2, 50));
}


function draw() {
	background(0)
	  system.addParticle();

  if (frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start();
  }
  system.run();
}


function keyPressed() {
  if (key === "c") {
    const capture = P5Capture.getInstance();
    if (capture.state === "idle") {
      capture.start();
    } else {
      capture.stop();
    }
  }
}


// A simple Particle class
let Particle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
  stroke(200, this.lifespan);
  strokeWeight(2);
  fill(127, this.lifespan);
  ellipse(this.position.x, this.position.y, 12, 12);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  return this.lifespan < 0;
};

let ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  for (let i = this.particles.length-1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};