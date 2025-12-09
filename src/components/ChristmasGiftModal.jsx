import React, { useState, useEffect, useRef } from 'react';
import { useChristmas } from '../context/ChristmasContext';

const ChristmasGiftModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const canvasRef = useRef(null);
  const { christmasMode, discount } = useChristmas();

  const CLICKS_NEEDED = 20;

  useEffect(() => {
    if (!christmasMode) return;

    // Check if user has already seen the gift this session
    const hasSeenGift = sessionStorage.getItem('christmasGiftSeen');
    if (!hasSeenGift) {
      setIsOpen(true);
      sessionStorage.setItem('christmasGiftSeen', 'true');
    }
  }, [christmasMode]);

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

    // Snowflake animation on canvas
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

  const handleGiftClick = () => {
    setClickCount(prev => prev + 1);
    const newCount = clickCount + 1;

    if (newCount >= CLICKS_NEEDED) {
      setIsOpened(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || !christmasMode) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] pointer-events-auto">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-4 md:gap-6 px-4">
        {/* Headline */}
        <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-white/20 text-center select-none">
          MERRY CHRISTMAS
        </div>

        {/* Instructions */}
        {!isOpened && (
          <div className="text-2xl md:text-4xl font-bold text-white text-center select-none animate-pulse">
            CHRISTMAS PIÑATA
          </div>
        )}

        {/* Gift Box Container */}
        <div className="relative w-40 h-40 md:w-56 md:h-56 perspective cursor-pointer" onClick={handleGiftClick}>
          {!isOpened ? (
            // Closed Gift
            <div
              className="w-full h-full relative transition-transform duration-300 hover:scale-105"
              style={{
                transformStyle: 'preserve-3d',
                animation: clickCount > 0 ? `wiggle 0.3s ease-in-out` : 'spin 4s linear infinite'
              }}
            >
              {/* Gift Box */}
              <div className="w-full h-full bg-red-600 rounded-lg shadow-2xl flex items-center justify-center border-4 border-red-700">
                {/* Gold Ribbon Horizontal */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-full h-12 bg-yellow-400 opacity-80"></div>
                </div>

                {/* Gold Ribbon Vertical */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute h-full w-12 bg-yellow-400 opacity-80"></div>
                </div>

                {/* Bow */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-12 pointer-events-none">
                  <div className="absolute left-0 w-8 h-8 bg-yellow-400 rounded-full"></div>
                  <div className="absolute right-0 w-8 h-8 bg-yellow-400 rounded-full"></div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-300 rounded-full"></div>
                </div>

                {/* Click Counter Text */}
                <div className="text-center select-none z-10">
                  <div className="text-white font-bold text-sm md:text-lg">
                    {clickCount}/{CLICKS_NEEDED}
                  </div>
                  <div className="text-white font-bold text-xs md:text-sm">
                    CLICK ME!
                  </div>
                </div>
              </div>

              <style>{`
                @keyframes spin {
                  0% { transform: rotateY(0deg) rotateX(5deg); }
                  100% { transform: rotateY(360deg) rotateX(5deg); }
                }
                @keyframes wiggle {
                  0%, 100% { transform: rotateZ(0deg) scale(1); }
                  25% { transform: rotateZ(-5deg) scale(1.05); }
                  75% { transform: rotateZ(5deg) scale(1.05); }
                }
              `}</style>
            </div>
          ) : (
            // Opened Gift - Show Discount
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 animate-bounce">
              {/* Explosion Effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-6xl md:text-8xl animate-ping">✨</div>
              </div>

              {/* Discount Badge */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-full w-40 h-40 md:w-56 md:h-56 flex flex-col items-center justify-center shadow-2xl border-8 border-yellow-400 relative z-10">
                <div className="text-6xl md:text-8xl font-black text-yellow-300">
                  {discount}%
                </div>
                <div className="text-white font-bold text-lg md:text-2xl text-center mt-2">
                  OFF
                </div>
                <div className="text-white font-semibold text-sm md:text-base text-center mt-2">
                  ALL ITEMS
                </div>
              </div>

              {/* Confetti Animation */}
              <style>{`
                @keyframes confetti {
                  0% { transform: translateY(0) rotateZ(0deg); opacity: 1; }
                  100% { transform: translateY(100vh) rotateZ(720deg); opacity: 0; }
                }
              `}</style>
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#0000ff'][i % 4],
                    animation: `confetti ${1 + Math.random() * 1}s ease-in forwards`,
                    animationDelay: `${Math.random() * 0.2}s`,
                    marginLeft: `${(Math.random() - 0.5) * 200}px`,
                    marginTop: `${(Math.random() - 0.5) * 200}px`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        {isOpened && (
          <button
            onClick={handleClose}
            className="mt-8 px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 transition shadow-lg text-lg md:text-xl"
          >
            Claim Discount! 🎉
          </button>
        )}

        {/* Skip Button */}
        {!isOpened && (
          <button
            onClick={handleClose}
            className="mt-4 text-white text-sm md:text-base hover:text-yellow-300 transition underline"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
};

export default ChristmasGiftModal;
