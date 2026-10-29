import React, { useState, useEffect, useRef } from 'react';
import { Crosshair, Target as TargetIcon, RotateCcw, Activity } from 'lucide-react';
import { ControlState, Target } from '../types';
import { soundFx } from '../utils/audio';

interface TargetSimulatorProps {
  controls: ControlState;
}

export const TargetSimulator: React.FC<TargetSimulatorProps> = ({ controls }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [crosshairPos, setCrosshairPos] = useState({ x: 250, y: 175 });
  const [score, setScore] = useState(0);
  const [headshots, setHeadshots] = useState(0);
  const [accuracy, setAccuracy] = useState(98.4);
  const [fps, setFps] = useState(120);

  // Targets state
  const targetsRef = useRef<Target[]>([
    { id: 1, x: 100, y: 80, vx: 1.2, vy: 0.8, isHead: true, locked: false },
    { id: 2, x: 280, y: 220, vx: -1.5, vy: 0.9, isHead: false, locked: false },
    { id: 3, x: 380, y: 110, vx: 1.0, vy: -1.1, isHead: true, locked: false },
    { id: 4, x: 200, y: 280, vx: -0.9, vy: -1.2, isHead: false, locked: false },
  ]);

  useEffect(() => {
    const fpsTimer = setInterval(() => {
      setFps(Math.floor(Math.random() * 6) + 117);
    }, 1200);
    return () => clearInterval(fpsTimer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Radar rings & grid
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.15)';
      ctx.lineWidth = 1;

      // Concentric circles
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 70, 0, Math.PI * 2);
      ctx.arc(width / 2, height / 2, 140, 0, Math.PI * 2);
      ctx.arc(width / 2, height / 2, 210, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshair guide axes
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // FOV Cone if Aimbot is ON
      if (controls.aimbot) {
        ctx.save();
        const fovRad = (controls.aimbotFov * Math.PI) / 360;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
        ctx.beginPath();
        ctx.moveTo(crosshairPos.x, crosshairPos.y);
        ctx.arc(
          crosshairPos.x,
          crosshairPos.y,
          180,
          -fovRad - Math.PI / 2,
          fovRad - Math.PI / 2
        );
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Update & render targets
      let bestTarget: Target | null = null;
      let minDistance = Infinity;

      const targets = targetsRef.current;
      for (const t of targets) {
        t.x += t.vx;
        t.y += t.vy;

        // Bounce off canvas walls
        if (t.x < 30 || t.x > width - 30) t.vx *= -1;
        if (t.y < 30 || t.y > height - 30) t.vy *= -1;

        const dist = Math.hypot(t.x - crosshairPos.x, t.y - crosshairPos.y);
        if (dist < minDistance) {
          minDistance = dist;
          bestTarget = t;
        }

        // Draw target node
        const isLocked = controls.aimLock && (bestTarget?.id === t.id || dist < 120);
        t.locked = isLocked;

        ctx.save();
        ctx.fillStyle = isLocked ? '#22c55e' : '#ef4444';
        ctx.shadowColor = isLocked ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
        ctx.shadowBlur = isLocked ? 14 : 8;

        // Center dot
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.isHead ? 7 : 9, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring
        ctx.strokeStyle = isLocked ? '#4ade80' : 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Rajdhani, monospace';
        ctx.fillText(
          `${t.isHead ? 'HEAD' : 'CHEST'} [${Math.round(dist)}m]`,
          t.x - 24,
          t.y - 20
        );

        // Lock brackets if locked
        if (isLocked) {
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 2;
          const s = 14;
          // Top-left
          ctx.beginPath();
          ctx.moveTo(t.x - s, t.y - s + 6);
          ctx.lineTo(t.x - s, t.y - s);
          ctx.lineTo(t.x - s + 6, t.y - s);
          ctx.stroke();
          // Top-right
          ctx.beginPath();
          ctx.moveTo(t.x + s - 6, t.y - s);
          ctx.lineTo(t.x + s, t.y - s);
          ctx.lineTo(t.x + s, t.y - s + 6);
          ctx.stroke();
          // Bottom-left
          ctx.beginPath();
          ctx.moveTo(t.x - s, t.y + s - 6);
          ctx.lineTo(t.x - s, t.y + s);
          ctx.lineTo(t.x - s + 6, t.y + s);
          ctx.stroke();
          // Bottom-right
          ctx.beginPath();
          ctx.moveTo(t.x + s - 6, t.y + s);
          ctx.lineTo(t.x + s, t.y + s);
          ctx.lineTo(t.x + s, t.y + s - 6);
          ctx.stroke();
        }

        ctx.restore();
      }

      // If Aimbot is active, crosshair automatically slews toward best target!
      if (controls.aimbot && bestTarget) {
        const speedFactor = (controls.aimbotSpeed / 100) * 0.18;
        const targetX = bestTarget.x;
        const targetY = bestTarget.y;

        setCrosshairPos((prev) => ({
          x: prev.x + (targetX - prev.x) * speedFactor,
          y: prev.y + (targetY - prev.y) * speedFactor,
        }));

        // Draw laser tracking line
        ctx.save();
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(crosshairPos.x, crosshairPos.y);
        ctx.lineTo(bestTarget.x, bestTarget.y);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Main Reticle
      ctx.save();
      const cx = crosshairPos.x;
      const cy = crosshairPos.y;

      const reticleColor = controls.aimbot || controls.aimLock ? '#22c55e' : '#ff2626';
      ctx.strokeStyle = reticleColor;
      ctx.shadowColor = reticleColor;
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2;

      // Central reticle circle
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Cross lines with gap
      ctx.beginPath();
      ctx.moveTo(cx - 28, cy);
      ctx.lineTo(cx - 18, cy);
      ctx.moveTo(cx + 18, cy);
      ctx.lineTo(cx + 28, cy);
      ctx.moveTo(cx, cy - 28);
      ctx.lineTo(cx, cy - 18);
      ctx.moveTo(cx, cy + 18);
      ctx.lineTo(cx, cy + 28);
      ctx.stroke();

      // Dot center
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [controls, crosshairPos]);

  // Handle tap / fire
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (!controls.aimbot) {
      setCrosshairPos({ x: clickX, y: clickY });
    }

    // Check hit
    soundFx.playClick(true);
    let hit = false;
    targetsRef.current.forEach((t) => {
      const dist = Math.hypot(t.x - clickX, t.y - clickY);
      if (dist < 30 || (controls.aimbot && t.locked)) {
        hit = true;
        setScore((s) => s + 100);
        if (t.isHead || controls.aimLockArea === 'Head') {
          setHeadshots((h) => h + 1);
        }
        // Respawn target
        t.x = Math.random() * (canvas.width - 60) + 30;
        t.y = Math.random() * (canvas.height - 60) + 30;
      }
    });

    if (hit) {
      setAccuracy((prev) => Math.min(100, prev + 0.1));
    }
  };

  const handleReset = () => {
    setScore(0);
    setHeadshots(0);
    soundFx.playClick(false);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-stone-900/90 to-black/90 border border-red-900/50 p-6 backdrop-blur-md">
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-950/60 border border-red-800 text-red-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Said Prime Aim Simulator
            </h3>
            <p className="text-xs text-zinc-400">
              রিয়েল-টাইম টার্গেট ট্র্যাকিং ও লক ডায়াগনস্টিক সিমুলেশন
            </p>
          </div>
        </div>

        {/* Live telemetry figures */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-zinc-500">FPS:</span>{' '}
            <span className="text-green-400 font-bold tabular-nums">{fps}</span>
          </div>
          <div>
            <span className="text-zinc-500">ACCURACY:</span>{' '}
            <span className="text-white font-bold tabular-nums">{accuracy.toFixed(1)}%</span>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="রিসেট স্কোর"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Radar Container */}
      <div className="relative mt-4 w-full aspect-[16/10] sm:aspect-[16/9] max-h-[380px] bg-black/80 rounded-xl overflow-hidden border border-red-950 shadow-inner flex items-center justify-center">
        {/* Holographic background grid */}
        <div className="absolute inset-0 bg-cyber-grid opacity-60 pointer-events-none" />

        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain cursor-crosshair z-10"
        />

        {/* Live HUD Overlays */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none flex flex-col gap-1 text-[11px] font-mono">
          <div className="text-red-400/90 font-semibold tracking-wider">
            [RADAR SCANNER ACTIVE]
          </div>
          <div className="text-zinc-400">
            AIM LOCK:{' '}
            <span className={controls.aimLock ? 'text-green-400 font-bold' : 'text-red-400'}>
              {controls.aimLock ? 'ENGAGED 🟢' : 'DISABLED 🔴'}
            </span>
          </div>
          <div className="text-zinc-400">
            AIMBOT:{' '}
            <span className={controls.aimbot ? 'text-green-400 font-bold' : 'text-red-400'}>
              {controls.aimbot ? `TRACKING ${controls.aimbotFov}° 🟢` : 'OFFLINE 🔴'}
            </span>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-20 pointer-events-none text-right text-xs font-mono text-zinc-300">
          <div>SCORE: <span className="text-red-400 font-bold tabular-nums">{score}</span></div>
          <div>HEADSHOTS: <span className="text-yellow-400 font-bold tabular-nums">{headshots}</span></div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
        <span>💡 টিপস: স্ক্রিনে ক্লিক করে ফায়ার করুন অথবা Aimbot অন করে অটো-লক পরীক্ষা করুন।</span>
        <span className="font-mono text-red-400/80">SAID PRIME CORE ENGINE</span>
      </div>
    </div>
  );
};
