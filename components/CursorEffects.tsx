import React, { useEffect, useRef } from 'react';

const CursorEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let targetMouse = { x: width / 2, y: height / 2 };
    let smoothMouse = { x: width / 2, y: height / 2 };

    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth spotlight follow
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.12;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.12;

      // Draw Stronger Spotlight
      const gradient = ctx.createRadialGradient(
        smoothMouse.x, smoothMouse.y, 0,
        smoothMouse.x, smoothMouse.y, 150 // Reduced spotlight radius
      );
      gradient.addColorStop(0, 'rgba(0, 229, 255, 0.15)'); // Increased from 0.08
      gradient.addColorStop(0.3, 'rgba(148, 29, 168, 0.05)'); // Increased from 0.03
      gradient.addColorStop(0.7, 'rgba(0, 229, 255, 0.01)'); // Increased from 0.005
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorEffects;
