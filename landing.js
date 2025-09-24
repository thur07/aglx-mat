/* landing.js
  - animações rápidas 2D no canvas demoCanvas
  - click para reiniciar
*/
(function(){
    const canvas = document.getElementById('demoCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
  
    // tamanho responsivo do canvas (mantém ratio)
    function fit(){
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.min(800, rect.width * devicePixelRatio);
      canvas.height = Math.min(500, rect.height * devicePixelRatio);
      ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    }
    fit();
    window.addEventListener('resize', fit);
  
    // pequenas sprites (círculos e quadrados) com movimento
    const sprites = [];
    function spawn(){
      const w = canvas.width/ (devicePixelRatio||1);
      const h = canvas.height/ (devicePixelRatio||1);
      for(let i=0;i<12;i++){
        sprites.push({
          x: Math.random()*w,
          y: Math.random()*h,
          vx: (Math.random()-0.5)*180,
          vy: (Math.random()-0.5)*140,
          size: 8 + Math.random()*18,
          hue: 200 + Math.random()*120,
          shape: Math.random()>0.5 ? 'circle' : 'rect',
          life: 2 + Math.random()*3
        });
      }
    }
    spawn();
  
    let last = performance.now();
    function loop(t){
      const dt = Math.min(0.04, (t-last)/1000);
      last = t;
      // background
      ctx.clearRect(0,0,canvas.width,canvas.height);
      // soft overlay
      ctx.fillStyle = 'rgba(11,0,30,0.18)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
  
      // update & draw
      for(let i=sprites.length-1;i>=0;i--){
        const s = sprites[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.995;
        s.vy *= 0.995;
        s.life -= dt;
        // wrap
        const w = canvas.width/(devicePixelRatio||1);
        const h = canvas.height/(devicePixelRatio||1);
        if(s.x < -50) s.x = w + 50;
        if(s.x > w + 50) s.x = -50;
        if(s.y < -50) s.y = h + 50;
        if(s.y > h + 50) s.y = -50;
  
        // draw glow
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size*3);
        grad.addColorStop(0, `hsla(${s.hue}, 90%, 60%, ${0.35*s.life})`);
        grad.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size*2.2, 0, Math.PI*2);
        ctx.fill();
  
        // shape
        ctx.fillStyle = `hsl(${s.hue}, 80%, 60%)`;
        if(s.shape === 'circle'){
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
          ctx.fill();
        }else{
          ctx.fillRect(s.x - s.size/1.4, s.y - s.size/1.4, s.size*1.8, s.size*1.8);
        }
  
        if(s.life <= 0){
          sprites.splice(i,1);
          // spawn new occasionally
          if(Math.random() < 0.8) sprites.push({
            x: Math.random()*w,
            y: Math.random()*h,
            vx: (Math.random()-0.5)*180,
            vy: (Math.random()-0.5)*140,
            size: 8 + Math.random()*18,
            hue: 200 + Math.random()*120,
            shape: Math.random()>0.5 ? 'circle' : 'rect',
            life: 2 + Math.random()*3
          });
        }
      }
  
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  
    // click to "burst"
    canvas.addEventListener('click', () => {
      // add a burst of sprites toward center
      const w = canvas.width/(devicePixelRatio||1);
      const h = canvas.height/(devicePixelRatio||1);
      for(let i=0;i<14;i++){
        sprites.push({
          x: Math.random()*w,
          y: Math.random()*h,
          vx: (Math.random()-0.5)*440,
          vy: (Math.random()-0.5)*440,
          size: 10 + Math.random()*22,
          hue: 200 + Math.random()*120,
          shape: Math.random()>0.5 ? 'circle' : 'rect',
          life: 1 + Math.random()*2
        });
      }
    });
  })();
  