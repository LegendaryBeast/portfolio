// Canvas particle field with mouse interaction and gentle parallax.
// Inspired by established HTML5 canvas particle techniques.
(() => {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let width, height, particles, mouse, rafId;

  const config = {
    countBase: 110,     // base particle count
    linkDist: 120,      // distance to draw link lines
    maxSpeed: 0.4,      // particle speed
    size: [1.0, 2.2],   // min/max radius
    color: 'rgba(122,162,255,0.9)',
    linkColor: 'rgba(122,162,255,0.18)'
  };

  function resize(){
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function rand(min, max){ return Math.random() * (max - min) + min }

  function initParticles(){
    const area = width * height;
    const density = config.countBase * (area / (1280*800));
    const count = Math.floor(density);
    particles = new Array(count).fill(0).map(() => ({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-config.maxSpeed, config.maxSpeed),
      vy: rand(-config.maxSpeed, config.maxSpeed),
      r: rand(config.size[0], config.size[1])
    }));
  }

  mouse = { x: width/2 || 0, y: height/2 || 0, down: false };

  function step(){
    ctx.clearRect(0, 0, width, height);

    // motion and bounds
    for(const p of particles){
      // gentle attraction to mouse when near
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist2 = dx*dx + dy*dy;
      const radius = 140;
      if(dist2 < radius*radius){
        const f = -0.03 * (1 - Math.sqrt(dist2)/radius);
        p.vx += f * dx;
        p.vy += f * dy;
      }

      p.x += p.vx;
      p.y += p.vy;

      // soft wrap
      if(p.x < -10) p.x = width + 10;
      if(p.x > width + 10) p.x = -10;
      if(p.y < -10) p.y = height + 10;
      if(p.y > height + 10) p.y = -10;
    }

    // draw links
    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      for(let j=i+1;j<particles.length;j++){
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if(dist < config.linkDist){
          const alpha = 1 - (dist / config.linkDist);
          ctx.strokeStyle = config.linkColor;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    // draw particles
    ctx.fillStyle = config.color;
    for(const p of particles){
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(step);
  }

  function onMouseMove(e){
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function onTouch(e){
    if(e.touches && e.touches[0]){
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('touchmove', onTouch, { passive: true });

  // kick off
  resize();
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(step);
})();
