import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.className = "fixed inset-0 w-full h-full pointer-events-none z-[1] opacity-60 mix-blend-screen";
    canvas.style.backfaceVisibility = 'hidden';
    container.appendChild(canvas);

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Check if worker and transferControlToOffscreen are supported natively
    const supportsOffscreen = 
      typeof window !== 'undefined' &&
      'transferControlToOffscreen' in HTMLCanvasElement.prototype &&
      typeof window.Worker !== 'undefined';

    let worker: Worker | null = null;
    let mainAnimationFrameId: number;
    let fallbackCleanup: (() => void) | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (worker) {
        worker.postMessage({ type: 'mousemove', x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseLeave = () => {
      if (worker) {
        worker.postMessage({ type: 'mouseleave' });
      }
    };

    let resizeTimeout: number;
    const handleResize = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        if (worker) {
          worker.postMessage({ type: 'resize', width: newWidth, height: newHeight });
        }
      }, 100);
    };

    if (supportsOffscreen) {
      try {
        const workerCode = `
          let canvas = null;
          let ctx = null;
          let width = 0;
          let height = 0;
          let particles = [];
          const mouse = { x: -1000, y: -1000, radius: 120 };
          let animationFrameId = null;

          class SparkParticle {
            constructor() {
              this.reset(true);
            }

            reset(initial = false) {
              this.x = Math.random() * width;
              this.y = initial ? Math.random() * height : height + 10;
              this.size = Math.random() * 1.8 + 0.6;
              this.speedX = (Math.random() - 0.5) * 0.3;
              this.speedY = -(Math.random() * 0.4 + 0.2);
              this.alpha = Math.random() * 0.45 + 0.15;
              this.color = Math.random() > 0.25 ? '255, 101, 0' : '156, 163, 175';
            }

            update() {
              this.y += this.speedY;
              this.x += this.speedX;

              if (this.y < -10) {
                this.reset();
              }
              if (this.x < -10) {
                this.x = width + 10;
              } else if (this.x > width + 10) {
                this.x = -10;
              }

              const dx = this.x - mouse.x;
              const dy = this.y - mouse.y;
              const distSq = dx * dx + dy * dy;
              const radiusSq = mouse.radius * mouse.radius;

              if (distSq < radiusSq) {
                const distance = Math.sqrt(distSq);
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 1.2;
                this.y += Math.sin(angle) * force * 1.2;
              }
            }

            draw() {
              if (!ctx) return;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(' + this.color + ', ' + this.alpha + ')';
              ctx.fill();

              if (this.color === '255, 101, 0') {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 101, 0, ' + (this.alpha * 0.15) + ')';
                ctx.fill();
              }
            }
          }

          function initParticles() {
            const particleCount = Math.min(75, Math.floor((width * height) / 18000));
            particles = [];
            for (let i = 0; i < particleCount; i++) {
              particles.push(new SparkParticle());
            }
          }

          function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
              particles[i].update();
              particles[i].draw();
            }

            animationFrameId = requestAnimationFrame(animate);
          }

          self.onmessage = function(e) {
            const data = e.data;
            if (data.type === 'init') {
              canvas = data.canvas;
              ctx = canvas.getContext('2d');
              width = data.width;
              height = data.height;
              if (canvas) {
                canvas.width = width;
                canvas.height = height;
              }
              initParticles();
              animate();
            } else if (data.type === 'resize') {
              width = data.width;
              height = data.height;
              if (canvas) {
                canvas.width = width;
                canvas.height = height;
              }
              initParticles();
            } else if (data.type === 'mousemove') {
              mouse.x = data.x;
              mouse.y = data.y;
            } else if (data.type === 'mouseleave') {
              mouse.x = -1000;
              mouse.y = -1000;
            }
          };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        worker = new Worker(workerUrl);

        // Transfer control to offscreen
        const offscreenCanvas = canvas.transferControlToOffscreen();
        worker.postMessage(
          {
            type: 'init',
            canvas: offscreenCanvas,
            width,
            height,
          },
          [offscreenCanvas]
        );

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);

        // Revoke immediately as it's loaded
        URL.revokeObjectURL(workerUrl);
      } catch (err) {
        console.warn('OffscreenCanvas or Worker initialization failed, falling back to main-thread rendering:', err);
        worker = null;
        setupMainThreadFallback();
      }
    } else {
      setupMainThreadFallback();
    }

    function setupMainThreadFallback() {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let currentWidth = canvas.width = window.innerWidth;
      let currentHeight = canvas.height = window.innerHeight;

      const localMouse = {
        x: -1000,
        y: -1000,
        radius: 120,
      };

      const localHandleMouseMove = (e: MouseEvent) => {
        localMouse.x = e.clientX;
        localMouse.y = e.clientY;
      };

      const localHandleMouseLeave = () => {
        localMouse.x = -1000;
        localMouse.y = -1000;
      };

      let localResizeTimeout: number;
      const localHandleResize = () => {
        window.clearTimeout(localResizeTimeout);
        localResizeTimeout = window.setTimeout(() => {
          currentWidth = canvas.width = window.innerWidth;
          currentHeight = canvas.height = window.innerHeight;
          initLocalParticles();
        }, 100);
      };

      class LocalSparkParticle {
        x!: number;
        y!: number;
        size!: number;
        speedX!: number;
        speedY!: number;
        alpha!: number;
        color!: string;

        constructor() {
          this.reset(true);
        }

        reset(initial = false) {
          this.x = Math.random() * currentWidth;
          this.y = initial ? Math.random() * currentHeight : currentHeight + 10;
          this.size = Math.random() * 1.8 + 0.6;
          this.speedX = (Math.random() - 0.5) * 0.3;
          this.speedY = -(Math.random() * 0.4 + 0.2);
          this.alpha = Math.random() * 0.45 + 0.15;
          this.color = Math.random() > 0.25 ? '255, 101, 0' : '156, 163, 175';
        }

        update() {
          this.y += this.speedY;
          this.x += this.speedX;

          if (this.y < -10) {
            this.reset();
          }
          if (this.x < -10) {
            this.x = currentWidth + 10;
          } else if (this.x > currentWidth + 10) {
            this.x = -10;
          }

          const dx = this.x - localMouse.x;
          const dy = this.y - localMouse.y;
          const distSq = dx * dx + dy * dy;
          const radiusSq = localMouse.radius * localMouse.radius;

          if (distSq < radiusSq) {
            const distance = Math.sqrt(distSq);
            const force = (localMouse.radius - distance) / localMouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 1.2;
            this.y += Math.sin(angle) * force * 1.2;
          }
        }

        draw() {
          if (!ctx) return;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
          ctx.fill();

          if (this.color === '255, 101, 0') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 101, 0, ${this.alpha * 0.15})`;
            ctx.fill();
          }
        }
      }

      let localParticles: LocalSparkParticle[] = [];

      function initLocalParticles() {
        const particleCount = Math.min(75, Math.floor((currentWidth * currentHeight) / 18000));
        localParticles = [];
        for (let i = 0; i < particleCount; i++) {
          localParticles.push(new LocalSparkParticle());
        }
      }

      const animateLocal = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, currentWidth, currentHeight);

        for (let i = 0; i < localParticles.length; i++) {
          localParticles[i].update();
          localParticles[i].draw();
        }

        mainAnimationFrameId = requestAnimationFrame(animateLocal);
      };

      initLocalParticles();
      animateLocal();

      window.addEventListener('mousemove', localHandleMouseMove);
      window.addEventListener('mouseleave', localHandleMouseLeave);
      window.addEventListener('resize', localHandleResize);

      fallbackCleanup = () => {
        cancelAnimationFrame(mainAnimationFrameId);
        window.removeEventListener('mousemove', localHandleMouseMove);
        window.removeEventListener('mouseleave', localHandleMouseLeave);
        window.removeEventListener('resize', localHandleResize);
        window.clearTimeout(localResizeTimeout);
      };
    }

    return () => {
      if (worker) {
        worker.terminate();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', handleResize);
        window.clearTimeout(resizeTimeout);
      }
      if (fallbackCleanup) {
        fallbackCleanup();
      }
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  );
}
