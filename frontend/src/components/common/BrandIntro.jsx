import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { AgriLogo } from './AgriLogo.jsx';

/**
 * BrandIntro Component
 *
 * Polished initial splash reveal for Agri Microclimate Agent.
 * Uses sessionStorage ('agri_intro_played') so it runs once per browser session.
 * Features translucent soft blur application backdrop, blur-to-sharp logo reveal,
 * subtitle fade, and 60fps progress line fill (~1.6s duration + 0.4s fade).
 */
export function BrandIntro({ onComplete, forceReplay = false }) {
  const [phase, setPhase] = useState(() => {
    // Check if intro has already been played in this browser session
    try {
      if (!forceReplay && typeof window !== 'undefined' && window.sessionStorage) {
        const played = window.sessionStorage.getItem('agri_intro_played');
        if (played === 'true') {
          return 'hidden';
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
    return 'active'; // 'active' | 'fading' | 'hidden'
  });

  useEffect(() => {
    if (phase === 'hidden') {
      if (onComplete) onComplete();
      return;
    }

    // Mark as played in sessionStorage
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem('agri_intro_played', 'true');
      }
    } catch (e) {
      // Ignore storage errors
    }

    // Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setPhase('hidden');
      if (onComplete) onComplete();
      return;
    }

    // 0ms - 1600ms: Smooth progress fill & logo blur-to-sharp
    // 1600ms - 2000ms: Smooth fade-out reveal of dashboard
    const fadeTimer = setTimeout(() => {
      setPhase('fading');
    }, 1600);

    const doneTimer = setTimeout(() => {
      setPhase('hidden');
      if (onComplete) onComplete();
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete, phase]);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`brand-intro-overlay ${phase === 'fading' ? 'intro-fade-out' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(248, 250, 247, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'opacity 400ms cubic-bezier(0.25, 1, 0.5, 1), transform 400ms cubic-bezier(0.25, 1, 0.5, 1)',
        opacity: phase === 'fading' ? 0 : 1,
        transform: phase === 'fading' ? 'scale(1.02)' : 'scale(1)',
        pointerEvents: phase === 'fading' ? 'none' : 'all',
      }}
    >
      {/* Background Soft Organic Glow */}
      <div
        style={{
          position: 'absolute',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46, 159, 69, 0.18) 0%, rgba(23, 107, 53, 0.05) 50%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Centered Brand Mark Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.15rem',
          textAlign: 'center',
          zIndex: 2,
          animation: 'brandLogoReveal 900ms cubic-bezier(0.25, 1, 0.5, 1) forwards',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AgriLogo size={90} />
        </div>

        <div>
          <h1
            style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              color: '#17301F',
              letterSpacing: '-0.03em',
              margin: 0,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            AGRI MICROCLIMATE AGENT
          </h1>
          <p
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#2E9F45',
              margin: '0.45rem 0 0 0',
            }}
          >
            HYPERLOCAL CLIMATE INTELLIGENCE
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginTop: '0.35rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#3D4F41',
            background: '#FFFFFF',
            padding: '0.45rem 1.2rem',
            borderRadius: '9999px',
            border: '1px solid #E2E8E2',
            boxShadow: '0 4px 14px rgba(23, 107, 53, 0.06)',
          }}
        >
          <ShieldCheck size={16} color="#2E9F45" />
          <span>FortyGuard · NASA POWER · Agronomic RAG</span>
        </div>

        {/* 60fps Continuous Smooth Progress Accent Line */}
        <div
          style={{
            width: '260px',
            height: '4px',
            background: '#E2E8E2',
            borderRadius: '9999px',
            marginTop: '1.5rem',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #2E9F45, #176B35)',
              borderRadius: '9999px',
              animation: 'introProgressBarFill 1.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
              willChange: 'width',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BrandIntro;

