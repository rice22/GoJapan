// Snow Animation Effect
class SnowAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
      willReadFrequently: false
    });
    this.particles = [];
    this.particleCount = 100;
    this.lastTime = 0;
    
 
    this.settings = {
      speed: { min: 1.5, max: 3.0 },  // speed range
      wind: -0.5,
      gravity: 0.15,                  // gravity
      size: { min: 1, max: 4 },       
      opacity: { min: 0.4, max: 0.9 }
    };

    this.init();
    this.animate();
  }

  init() {
    // initial snow particles
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }

  
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
      }, 250);
    });
    
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  createParticle(x = null, y = null) {
    return {
      x: x || Math.random() * this.canvas.width,
      y: y || (Math.random() * -100) - 10,  // Start slightly above viewport
      size: Math.random() * (this.settings.size.max - this.settings.size.min) + this.settings.size.min,
      speed: Math.random() * (this.settings.speed.max - this.settings.speed.min) + this.settings.speed.min,
      opacity: Math.random() * (this.settings.opacity.max - this.settings.opacity.min) + this.settings.opacity.min,
      wobble: {
        x: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.2 + 0.1
      }
    };
  }

  updateParticle(particle, deltaTime) {
   
    const timeScale = deltaTime / 16;
    
     
    particle.wobble.x += particle.wobble.speed * timeScale;
    const wobbleX = Math.sin(particle.wobble.x) * 0.5;

    // time scaling
    particle.x += (wobbleX + this.settings.wind) * timeScale;
    particle.y += particle.speed * timeScale;

  
    if (particle.y > this.canvas.height || 
        particle.x < -20 || 
        particle.x > this.canvas.width + 20) {
      Object.assign(particle, this.createParticle(
        Math.random() * this.canvas.width,
        -10
      ));
    }
  }

  drawParticle(particle) {
    
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
    this.ctx.fill();
    
  
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity + 0.2})`;
    this.ctx.fill();
  }

  animate(currentTime = 0) {
  
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Clear canvas with slight motion blur for smoother appearance
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


    for (let particle of this.particles) {
      this.updateParticle(particle, deltaTime);
      this.drawParticle(particle);
    }

    requestAnimationFrame((time) => this.animate(time));
  }
}

// Initialize snow animation
function initNaturalFalling(canvas) {
  return new SnowAnimation(canvas);
} 