import React, { useEffect, useState } from 'react';

export const StylishCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailerPos, setTrailerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer');

        const isInputField =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable;

        setIsHovered(Boolean(isClickable));
        setIsInput(Boolean(isInputField));
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const animateTrailer = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      setTrailerPos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(animateTrailer);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animationFrameId = requestAnimationFrame(animateTrailer);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Glowing Cyber Ring Follower */}
      <div
        className={`fixed top-0 left-0 rounded-full transition-all duration-100 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isHovered
            ? 'w-12 h-12 border-2 border-emerald-400 bg-emerald-500/20 shadow-[0_0_24px_rgba(34,197,94,0.7)] scale-110'
            : isInput
            ? 'w-7 h-7 border border-cyan-400/80 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.5)] rounded-md'
            : 'w-8 h-8 border border-emerald-500/60 bg-emerald-500/5 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
        }`}
        style={{
          transform: `translate3d(${trailerPos.x}px, ${trailerPos.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Center Precision Sci-Fi Core Dot */}
      <div
        className={`fixed top-0 left-0 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors ${
          isInput ? 'w-1.5 h-3 bg-cyan-400 shadow-[0_0_10px_#06b6d4]' : 'w-2 h-2 bg-emerald-400 shadow-[0_0_12px_#22c55e]'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />
    </div>
  );
};

export default StylishCursor;
