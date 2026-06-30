import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './FireAshBackground.css';

export function FireAshBackground({visible=true}) {

  const ash = useMemo(
    () =>
      Array.from({ length: 35 }, () => ({
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 3 + 2}px`,
        delay: `${Math.random() * 8}s`,
        duration: `${Math.random() * 8 + 8}s`,
      })),
    []
  );

  const smoke = Array.from({ length: 20 });

  if(!visible) return null;

  return (
    <motion.div 
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 5, delay: 0.5}}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#090504]"
    >

      {/* FIRE GLOW */}
      <div className="absolute inset-x-[-20%] bottom-[-25%] h-[70vh] bg-[radial-gradient(ellipse_at_bottom,rgba(255,120,20,0.65),rgba(180,40,10,0.25)_35%,rgba(20,5,0,0)_70%)] animate-fireGlow" />
      <div className="absolute inset-x-[10%] bottom-[-20%] h-[45vh] blur-2xl opacity-60 bg-[radial-gradient(ellipse_at_bottom,rgba(255,210,120,0.28),transparent_65%)] animate-fireFlicker [animation-duration:0.1]" />

      {/* SOFT UPPER WARMTH */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,170,70,0.18),transparent_45%)]" />

      {/* ASH PARTICLES */}
      {ash.map((p, i) => <AshParticle p={p} key={i} />)}

      {/* SMOKE */}
      {smoke.map((_, i) => <SmokeParticle i={i} key={i} />)}

    </motion.div>
  );
}


function AshParticle({p}) {
  return (
    <span
      className="absolute -bottom-5 rounded-full bg-orange-100/50 blur-px animate-ash"
      style={{
        left: p.left,
        width: `${Math.random() * 1.2 + 1}px`,
        height: `${Math.random() * 5 + 3}px`,
        animationDelay: p.delay,
        animationDuration: p.duration,
        drift: `${Math.random() * 120 - 60}px`,
      }}
    />
  )
}


function SmokeParticle({i}) {

  const drift = 12;

  return (
    <div 
      className="absolute z-1 blur-xs bottom-[-40vh] h-[90vh] w-[90vw] bg-[url('/graphics/smoke.png')] bg-contain bg-center bg-no-repeat mix-blend-multiply animate-smoke"
      style={{
        bottom: `${-40 + Math.random() * i * 12}vh`,
        left: 0,
        animationDelay: `${i}s`,
        animationDuration: `${20}s`,
        '--smoke-scale': 1.2 + i * 0.2,
        '--smoke-drift': `${i % 2 === 0 ? drift : 0-drift}vw`,
        transform: `scale(${1.2 + (i/2) * 0.2})`,
      }}
    />
  )
}