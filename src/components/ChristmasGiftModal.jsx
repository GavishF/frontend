import React, { useState, useEffect, useRef } from 'react';
import { useHoliday } from '../context/HolidayContext';
import './ChristmasGiftModal.css';

const ChristmasGiftModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [autoOpening, setAutoOpening] = useState(false);
  const canvasRef = useRef(null);
  const presentRef = useRef(null);
  const { holidayMode, discount } = useHoliday();

  useEffect(() => {
    if (!holidayMode) return;

    const hasSeenGift = sessionStorage.getItem('holidayGiftSeen');
    if (!hasSeenGift) {
      setIsOpen(true);
      sessionStorage.setItem('holidayGiftSeen', 'true');
    }
  }, [holidayMode]);

  // Auto-open after 9 seconds
  useEffect(() => {
    if (!isOpen || isOpened) return;

    const timer = setTimeout(() => {
      setAutoOpening(true);
      setTimeout(() => {
        setIsOpened(true);
      }, 1000);
    }, 9000);

    return () => clearTimeout(timer);
  }, [isOpen, isOpened]);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const snowflakes = [];
    const maxSnowflakes = Math.min(100, Math.max(canvas.width / 20, 50));

    class Snowflake {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = Math.random() * 1 + 0.5;
        this.size = Math.random() * 3 + 2;
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;

        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }

        this.draw();
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < maxSnowflakes; i++) {
      snowflakes.push(new Snowflake());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snowflakes.forEach(flake => flake.update());

      if (snowflakes.length < maxSnowflakes && Math.random() > 0.95) {
        snowflakes.push(new Snowflake());
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Dispatch event to trigger calendar scroll
    window.dispatchEvent(new CustomEvent('holidaygift:close'));
  };

  if (!isOpen || !holidayMode) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000] pointer-events-auto overflow-hidden backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <style>{`
        @keyframes present-rotate {
          0% { transform: rotateY(0) rotateX(-5deg); }
          100% { transform: rotateY(360deg) rotateX(-5deg); }
        }

        @keyframes lid-animation {
          0% { transform: translate3d(0, 0, 0) rotateX(0); }
          5% { transform: translate3d(0, -10px, -5px) rotateX(5deg); }
          10% { transform: translate3d(0, -10px, 5px) rotateX(-5deg); }
          15% { transform: translate3d(0, -10px, -5px) rotateX(5deg); }
          20% { transform: translate3d(0, -10px, 5px) rotateX(-5deg); }
          25% { transform: translate3d(0, -10px, -5px) rotateX(5deg); }
          30% { transform: translate3d(0, 0, 0) rotateX(0); }
        }

        @keyframes confetti {
          0% { transform: translateY(0) rotateZ(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(100vh) rotateZ(720deg) scale(0); opacity: 0; }
        }

        @keyframes scale-in {
          0% { transform: scale(0) rotateX(180deg); opacity: 0; }
          50% { transform: scale(1.1) rotateX(0deg); }
          100% { transform: scale(1) rotateX(0deg); opacity: 1; }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 30px rgba(220, 38, 38, 0.6));
          }
          50% { 
            filter: drop-shadow(0 0 50px rgba(220, 38, 38, 0.9));
          }
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center justify-center gap-4 md:gap-6 px-4 w-full h-full">
        {/* Epic Title */}
        <div className="text-center select-none mb-8" style={{ animation: 'scale-in 1s ease-out' }}>
          <div className="text-5xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-lg" style={{ fontFamily: "'Mountains of Christmas', cursive" }}>
            SPECIAL GIFT
          </div>
          <div className="text-lg md:text-2xl text-white/90 font-semibold mt-2 drop-shadow">
            A Festive Surprise Awaits
          </div>
        </div>

        {/* 3D Gift Box Container - Properly centered */}
        <div className="flex items-center justify-center flex-1 w-full">
          {!isOpened ? (
            <div
              ref={presentRef}
              className="gift-present"
              style={{
                animation: autoOpening ? 'scale-in 0.8s ease-out' : 'present-rotate 20s linear infinite, pulse-glow 2s ease-in-out infinite'
              }}
            >
              <div className="wiggle-container">
                <div className="rotate-container">
                  <div className="bottom"></div>
                  <div className="front"></div>
                  <div className="left"></div>
                  <div className="back"></div>
                  <div className="right"></div>

                  <div className="lid">
                    <div className="lid-top"></div>
                    <div className="lid-front"></div>
                    <div className="lid-left"></div>
                    <div className="lid-back"></div>
                    <div className="lid-right"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Opened Gift - Show Discount with Epic Effect
            <div className="flex flex-col items-center justify-center gap-4 relative z-10" style={{ animation: 'scale-in 0.6s ease-out' }}>
            {/* Explosion Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-8xl md:text-9xl animate-ping absolute">✨</div>
            </div>

            {/* Discount Badge - Epic Style */}
            <div className="bg-gradient-to-br from-red-600 via-red-500 to-red-700 rounded-full w-48 h-48 md:w-64 md:h-64 flex flex-col items-center justify-center shadow-2xl border-8 border-yellow-300 relative z-10" style={{ animation: 'pulse-glow 1s ease-in-out' }}>
              <div className="text-7xl md:text-9xl font-black text-yellow-200 drop-shadow-lg">
                {discount}%
              </div>
              <div className="text-white font-black text-2xl md:text-3xl text-center mt-3 drop-shadow">
                OFF
              </div>
              <div className="text-yellow-100 font-bold text-lg md:text-xl text-center mt-2 drop-shadow">
                EVERYTHING
              </div>
            </div>

            {/* Confetti Animation */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff', '#00ffff'][i % 6],
                  animation: `confetti ${1.5 + Math.random() * 1.5}s ease-in forwards`,
                  animationDelay: `${Math.random() * 0.3}s`,
                  marginLeft: `${(Math.random() - 0.5) * 300}px`,
                  marginTop: `${(Math.random() - 0.5) * 300}px`
                }}
              />
            ))}
          </div>
          )}
        </div>
        {/* Close Button - Only show after opened */}
        {isOpened && (
          <button
            onClick={handleClose}
            className="mt-8 px-10 py-4 bg-gradient-to-r from-yellow-300 to-yellow-400 text-red-700 font-black rounded-full hover:from-yellow-200 hover:to-yellow-300 transition shadow-xl text-xl md:text-2xl transform hover:scale-105"
            style={{ animation: 'scale-in 0.6s ease-out 0.3s both' }}
          >
            Claim Now! 🎁
          </button>
        )}

        {/* Auto-opening indicator */}
        {!isOpened && !autoOpening && (
          <div className="mt-6 text-white/70 text-sm md:text-base text-center animate-pulse">
            Opening in moments...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChristmasGiftModal;
