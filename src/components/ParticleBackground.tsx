import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const dimensionsRef = useRef({ width: typeof window !== 'undefined' ? window.innerWidth : 800, height: typeof window !== 'undefined' ? window.innerHeight : 600 });
  
  // Track multiple user-initiated expanding click pulses
  const clicksRef = useRef<Array<{
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    speed: number;
  }>>([]);

  const isLightModeRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect theme mode matching current system state
    isLightModeRef.current = document.documentElement.classList.contains('light');

    // Create a MutationObserver to instantly capture user light/dark theme toggles
    const themeObserver = new MutationObserver(() => {
      isLightModeRef.current = document.documentElement.classList.contains('light');
    });
    
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Device Pixel Ratio scaling for retina crispness (prevents blur)
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      dimensionsRef.current = { width, height };
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse locations & click events across window bounds
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleWindowClick = (e: MouseEvent) => {
      clicksRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.min(window.innerWidth, window.innerHeight) * 0.75 || 400,
        speed: 6.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleWindowClick);

    // Core Animation loop using requestAnimationFrame
    let animationFrameId: number;

    const animate = (time: number) => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = dimensionsRef.current;

      // Clear the viewport
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Re-apply scale factor each frame in case dpr changes or coordinates scaled
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Two slow-moving, autonomous ambient hotspots that float across the screen
      // mimicking the video where circular hotspots slide over the grid to highlight dots
      const hotspot1 = {
        x: width * (0.5 + 0.32 * Math.sin(time * 0.00035)),
        y: height * (0.5 + 0.26 * Math.cos(time * 0.00028)),
        radius: Math.min(width, height) * 0.30 || 220,
      };

      const hotspot2 = {
        x: width * (0.5 + 0.38 * Math.cos(time * 0.00022)),
        y: height * (0.5 + 0.28 * Math.sin(time * 0.00045)),
        radius: Math.min(width, height) * 0.34 || 250,
      };

      // Progress active click waves
      const clicks = clicksRef.current;
      for (let i = clicks.length - 1; i >= 0; i--) {
        const pulse = clicks[i];
        pulse.radius += pulse.speed;
        if (pulse.radius > pulse.maxRadius) {
          clicks.splice(i, 1);
        }
      }

      // Grid spacing parameters
      const spacing = 28;
      const offsetX = (width % spacing) / 2;
      const offsetY = (height % spacing) / 2;

      const cols = Math.floor(width / spacing) + 1;
      const rows = Math.floor(height / spacing) + 1;

      const isLight = isLightModeRef.current;
      
      // Fine-tune dot styles for light / dark ambient compatibility
      const baseDotColor = isLight ? '71, 85, 105' : '148, 163, 184';
      const baseDotOpacity = isLight ? 0.07 : 0.09;

      const mouse = mouseRef.current;
      const mouseRadius = 140;

      // Nested loop across 2D coordinates
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * spacing + offsetX;
          const y = r * spacing + offsetY;

          let highlightIntensity = 0;
          let glowColor = '255, 101, 0'; // Fallback / Mouse Orange accent: #FF6500

          // Impact evaluation: 1. Mouse coordinate proximity (Interactive glowing orange)
          if (mouse.active) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const distSq = dx * dx + dy * dy;
            const activeRadiusSq = mouseRadius * mouseRadius;
            if (distSq < activeRadiusSq) {
              const distance = Math.sqrt(distSq);
              const factor = (mouseRadius - distance) / mouseRadius;
              highlightIntensity += Math.pow(factor, 1.8);
            }
          }

          // Impact evaluation: 2. Hotspot 1 (Autonomous wave that turns dots into deep glowing violet/indigo)
          const dx1 = x - hotspot1.x;
          const dy1 = y - hotspot1.y;
          const dist1Sq = dx1 * dx1 + dy1 * dy1;
          const r1Sq = hotspot1.radius * hotspot1.radius;
          if (dist1Sq < r1Sq) {
            const distance = Math.sqrt(dist1Sq);
            const factor = (hotspot1.radius - distance) / hotspot1.radius;
            const h1Val = Math.pow(factor, 2.2);
            highlightIntensity += h1Val;
            // Hotspot 1 brings a soft ambient Indigo violet (#7C3AED) hue
            if (h1Val > 0.04) {
              glowColor = '124, 58, 237'; 
            }
          }

          // Impact evaluation: 3. Hotspot 2 (Autonomous wave that accents in deep glowing blue/cyan)
          const dx2 = x - hotspot2.x;
          const dy2 = y - hotspot2.y;
          const dist2Sq = dx2 * dx2 + dy2 * dy2;
          const r2Sq = hotspot2.radius * hotspot2.radius;
          if (dist2Sq < r2Sq) {
            const distance = Math.sqrt(dist2Sq);
            const factor = (hotspot2.radius - distance) / hotspot2.radius;
            const h2Val = Math.pow(factor, 2.0);
            highlightIntensity += h2Val;
            // Hotspot 2 brings a secondary cyan-blue hue
            if (h2Val > 0.1 && glowColor !== '124, 58, 237') {
              glowColor = '14, 116, 144'; // cyan-700 / dark teal-cyan
            }
          }

          // Impact evaluation: 4. User-initiated Click waves (Rapid expanding pulse)
          for (let i = 0; i < clicks.length; i++) {
            const pulse = clicks[i];
            const dx = x - pulse.x;
            const dy = y - pulse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const distDiff = Math.abs(distance - pulse.radius);
            const pulseWidth = 45; // Thickness of the pulse wave index
            if (distDiff < pulseWidth) {
              const factor = (pulseWidth - distDiff) / pulseWidth;
              const opacityFalloff = 1.0 - (pulse.radius / pulse.maxRadius);
              highlightIntensity += Math.pow(factor, 1.4) * opacityFalloff * 1.6;
              // Click waves flash in the brand's bright neon orange
              glowColor = '255, 101, 0';
            }
          }

          // Draw the physical dot circle
          ctx.beginPath();
          if (highlightIntensity > 0.01) {
            // Amplified states (glowing vibrant color with custom radius adjustment)
            const targetAlpha = Math.min(1.0, baseDotOpacity + highlightIntensity * 0.95);
            const targetRadius = 1.0 + Math.min(2.0, highlightIntensity * 1.6);
            ctx.arc(x, y, targetRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${glowColor}, ${targetAlpha})`;
            ctx.fill();

            // Render a smooth secondary background blur ring for active nodes without resorting to shadowBlur filter (which causes latency)
            if (highlightIntensity > 0.14) {
              ctx.beginPath();
              ctx.arc(x, y, targetRadius * 3.8, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${glowColor}, ${highlightIntensity * 0.16})`;
              ctx.fill();
            }
          } else {
            // Dormant / standard state (clean, low-contrast dot grid alignment)
            ctx.arc(x, y, 1.0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${baseDotColor}, ${baseDotOpacity})`;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Precise DOM removal and listener teardowns
    return () => {
      cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] mix-blend-normal dark:mix-blend-screen opacity-90 dark:opacity-75"
      style={{ backfaceVisibility: 'hidden' }}
    />
  );
}