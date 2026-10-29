import React, { useEffect, useRef } from 'react';

interface LightningBolt {
  segments: { x: number; y: number }[];
  color: string;
  glowColor: string;
  width: number;
  alpha: number;
  decay: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface LightningCanvasProps {
  intensity?: 'low' | 'medium' | 'high';
  isSpike?: boolean; // When triggered by Aimbot switch
}

export const LightningCanvas: React.FC<LightningCanvasProps> = ({
  intensity = 'high',
  isSpike = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const bolts: LightningBolt[] = [];
    const particles: Particle[] = [];
    let flashAlpha = 0;

    // Helper to generate a procedural branching lightning bolt
    const createBolt = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      isWhite = false,
      branchDepth = 0
    ) => {
      const segments: { x: number; y: number }[] = [{ x: startX, y: startY }];
      let currentX = startX;
      let currentY = startY;

      const totalSteps = Math.floor(Math.random() * 8) + 12;
      const dx = (endX - startX) / totalSteps;
      const dy = (endY - startY) / totalSteps;

      for (let i = 1; i <= totalSteps; i++) {
        const jitter = (Math.random() - 0.5) * 55;
        currentX += dx + jitter;
        currentY += dy + (Math.random() - 0.5) * 15;
        segments.push({ x: currentX, y: currentY });

        // Chance to spawn a sub-branch
        if (branchDepth < 2 && Math.random() < 0.22) {
          const branchAngle = (Math.random() - 0.5) * 1.2;
          const branchLength = (Math.random() * 80 + 40);
          const branchEndX = currentX + Math.sin(branchAngle) * branchLength;
          const branchEndY = currentY + Math.cos(branchAngle) * branchLength;
          createBolt(currentX, currentY, branchEndX, branchEndY, Math.random() > 0.5, branchDepth + 1);
        }
      }

      bolts.push({
        segments,
        color: isWhite ? '#ffffff' : '#ff2626',
        glowColor: isWhite ? 'rgba(255, 255, 255, 0.9)' : 'rgba(239, 68, 68, 0.85)',
        width: isWhite ? 2.5 : 1.8,
        alpha: 1,
        decay: Math.random() * 0.04 + 0.05,
      });
    };

    // Helper to trigger a lightning strike
    const triggerStrike = (forceWhite = false) => {
      const startX = Math.random() * width;
      const startY = Math.random() * (height * 0.25);
      const endX = startX + (Math.random() - 0.5) * 260;
      const endY = height * (0.6 + Math.random() * 0.4);

      const isWhite = forceWhite || Math.random() > 0.4;
      createBolt(startX, startY, endX, endY, isWhite, 0);

      // Trigger cloud flash
      flashAlpha = isWhite ? 0.28 : 0.2;

      // Spawn electrical sparks at strike zone
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: endX + (Math.random() - 0.5) * 50,
          y: endY,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 5 - 1,
          size: Math.random() * 2.5 + 1,
          color: Math.random() > 0.5 ? '#ffffff' : '#ef4444',
          alpha: 1,
          life: 0,
          maxLife: 30 + Math.random() * 20,
        });
      }
    };

    // If spike requested from outside
    if (isSpike) {
      triggerStrike(true);
      triggerStrike(false);
      triggerStrike(true);
    }

    let lastStrikeTime = performance.now();
    const strikeInterval = intensity === 'high' ? 800 : intensity === 'medium' ? 1600 : 2500;

    // Ambient floating particles
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 1.2 - 0.3,
        size: Math.random() * 2 + 0.8,
        color: Math.random() > 0.7 ? '#ffffff' : '#ef4444',
        alpha: Math.random() * 0.6 + 0.2,
        life: Math.random() * 100,
        maxLife: 150,
      });
    }

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      // Random strike check
      if (now - lastStrikeTime > strikeInterval + (Math.random() * 900 - 450)) {
        triggerStrike(Math.random() > 0.45);
        if (Math.random() < 0.35) {
          // Double quick strike
          setTimeout(() => triggerStrike(true), 90);
        }
        lastStrikeTime = now;
      }

      // Draw background cloud sheet flash
      if (flashAlpha > 0.005) {
        ctx.fillStyle = `rgba(220, 38, 38, ${flashAlpha * 0.5})`;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.4})`;
        ctx.fillRect(0, 0, width, height * 0.6);
        flashAlpha *= 0.86;
      }

      // Render and update lightning bolts
      for (let b = bolts.length - 1; b >= 0; b--) {
        const bolt = bolts[b];
        if (bolt.segments.length < 2) continue;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
        for (let s = 1; s < bolt.segments.length; s++) {
          ctx.lineTo(bolt.segments[s].x, bolt.segments[s].y);
        }

        ctx.strokeStyle = bolt.color;
        ctx.lineWidth = bolt.width;
        ctx.globalAlpha = bolt.alpha;
        ctx.shadowColor = bolt.glowColor;
        ctx.shadowBlur = 18;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'miter';
        ctx.stroke();

        // Extra white core
        ctx.beginPath();
        ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
        for (let s = 1; s < bolt.segments.length; s++) {
          ctx.lineTo(bolt.segments[s].x, bolt.segments[s].y);
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(0.7, bolt.width * 0.4);
        ctx.stroke();
        ctx.restore();

        bolt.alpha -= bolt.decay;
        if (bolt.alpha <= 0) {
          bolts.splice(b, 1);
        }
      }

      // Render floating spark particles
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life++;

        if (pt.y < 0) pt.y = height;
        if (pt.x < 0) pt.x = width;
        if (pt.x > width) pt.x = 0;

        const currentAlpha = pt.alpha * (1 - pt.life / pt.maxLife);
        if (currentAlpha > 0) {
          ctx.save();
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = Math.max(0, currentAlpha);
          ctx.shadowColor = pt.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (pt.life >= pt.maxLife) {
          pt.x = Math.random() * width;
          pt.y = height + 10;
          pt.life = 0;
          pt.alpha = Math.random() * 0.6 + 0.2;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity, isSpike]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90 mix-blend-screen"
      aria-hidden="true"
    />
  );
};
