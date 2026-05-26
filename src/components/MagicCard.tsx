import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  disableHoverAmbient?: boolean;
  whileHover?: any;
}

export default function MagicCard({ 
  children, 
  className = '', 
  onClick, 
  tabIndex, 
  onKeyDown,
  disableHoverAmbient = false,
  whileHover
}: MagicCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsLightMode(document.documentElement.classList.contains('light'));

    // Observe changes to the class attribute on the document element to track theme swap dynamically
    const observer = new MutationObserver(() => {
      setIsLightMode(document.documentElement.classList.contains('light'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const isActive = isHovered || isFocused;

  // Canvas-based particles for the premium hover effect
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    decay: number;
  }[]>([]);
  const requestRef = useRef<number | null>(null);

  const startAnimationLoop = () => {
    if (requestRef.current) return;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        requestRef.current = null;
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        requestRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#FF6500';
        ctx.shadowColor = '#FF6500';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // Spawn ambient particles across the entire card when active (hovered or focused)
      if (isActive) {
        // Continuous rise from the bottom of the card
        if (Math.random() < 0.28) {
          particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 6,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -(Math.random() * 0.8 + 0.4), // upward float
            size: Math.random() * 2.2 + 0.6,
            alpha: Math.random() * 0.75 + 0.25,
            decay: Math.random() * 0.007 + 0.003,
          });
        }

        // Randomly sparkle throughout the entire body of the card
        if (Math.random() < 0.2) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -(Math.random() * 0.4 + 0.1),
            size: Math.random() * 1.8 + 0.5,
            alpha: Math.random() * 0.6 + 0.2,
            decay: Math.random() * 0.012 + 0.005,
          });
        }
      }

      if (particles.length > 0 || isActive) {
        requestRef.current = requestAnimationFrame(render);
      } else {
        requestRef.current = null;
      }
    };

    requestRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    }
    if (isActive) {
      startAnimationLoop();
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isActive]);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (!isHovered) {
      setIsHovered(true);
    }
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    
    mouseX.set(x);
    mouseY.set(y);

    // Sync canvas sizing if necessary
    const canvas = canvasRef.current;
    if (canvas) {
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    }
  }

  function handleMouseClick(e: React.MouseEvent) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
    };
    
    setRipples((prev) => [...prev, newRipple]);
    
    // Auto clear ripple after animation completion
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) {
      onClick();
    }
  }

  function handleFocus() {
    setIsFocused(true);
    // Center the spotlight on focus so the card glows immediately
    const canvas = canvasRef.current;
    if (canvas) {
      mouseX.set(canvas.width / 2);
      mouseY.set(canvas.height / 2);
    }
  }

  function handleBlur() {
    setIsFocused(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const canvas = canvasRef.current;
      const x = canvas ? canvas.width / 2 : 100;
      const y = canvas ? canvas.height / 2 : 100;
      
      const newRipple = {
        id: Date.now() + Math.random(),
        x,
        y,
      };
      
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);

      if (onClick) {
        onClick();
      }
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleMouseClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex !== undefined ? tabIndex : (onClick ? 0 : undefined)}
      whileHover={
        disableHoverAmbient 
          ? undefined 
          : (whileHover || { 
              scale: 1.03,
              boxShadow: "0px 12px 40px rgba(255, 101, 0, 0.18)"
            })
      }
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      className={`relative rounded-3xl p-[6px] overflow-hidden transition-all duration-300 bg-navy-blue/40 ${
        disableHoverAmbient ? '' : 'hover:bg-navy-blue/75'
      } select-none outline-none ${
        onClick 
          ? `cursor-pointer ${
              disableHoverAmbient 
                ? '' 
                : 'hover:shadow-[0_12px_40px_rgba(255,101,0,0.15)] focus:shadow-[0_12px_40px_rgba(255,101,0,0.25)]'
            }` 
          : 'hover:shadow-[0_12px_40px_rgba(255,101,0,0.12)]'
      }`}
    >
      {/* Dynamic Border Glow Layer (tracks cursor position across the border gap) */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              220px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 101, 0, 0.95),
              transparent 70%
            )
          `,
          opacity: isActive ? 1 : 0,
        }}
      />

      {/* Inner Content Card (offsets boundary to create the thick shining border outline) */}
      <div className="relative h-full w-full rounded-[18px] bg-bg-card overflow-hidden">
        {/* Spotlight Ambient Inside Background Glow */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[18px] opacity-0 transition duration-500"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                350px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 101, 0, 0.08),
                transparent 80%
              )
            `,
            opacity: isActive ? 1 : 0,
          }}
        />

        {/* Real-time Hover Sparks Dynamic Canvas */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 w-full h-full z-0 rounded-[18px] opacity-90 mix-blend-screen"
        />

        {/* Dynamic click visual ripple waves */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ transform: 'translate(-50%, -50%) scale(0)', opacity: 0.6 }}
            animate={{ transform: 'translate(-50%, -50%) scale(5)', opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`absolute rounded-full pointer-events-none z-0 transition-colors duration-300 ${
              isLightMode ? 'bg-indigo-600/25' : 'bg-primary/25'
            }`}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '80px',
              height: '80px',
              boxShadow: isLightMode ? '0 0 15px rgba(79, 70, 229, 0.25)' : '0 0 15px rgba(255, 101, 0, 0.25)',
            }}
          />
        ))}

        {/* Real Content Container */}
        <div className={`relative z-10 w-full h-full ${className}`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

