import React, { useEffect, useState } from 'react';
import { FaRegSnowflake } from 'react-icons/fa';

const Snowflakes = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = {
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 12 + Math.random() * 6,
        opacity: 0.4 + Math.random() * 0.4,
        size: 8 + Math.random() * 12,
        wobbleAmount: 20 + Math.random() * 40
      };
      return snowflake;
    };

    // Create initial snowflakes
    const initialSnowflakes = Array.from({ length: 40 }, createSnowflake);
    setSnowflakes(initialSnowflakes);

    // Add new snowflakes periodically
    const interval = setInterval(() => {
      setSnowflakes(prev => [
        ...prev.slice(-100),
        createSnowflake()
      ]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
      {snowflakes.map(snowflake => (
        <div
          key={snowflake.id}
          className="absolute animate-fall"
          style={{
            left: `${snowflake.left}%`,
            top: '-30px',
            opacity: snowflake.opacity,
            animation: `fall ${snowflake.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${snowflake.delay}s infinite`,
            fontSize: `${snowflake.size}px`,
            '--wobble': `${snowflake.wobbleAmount}px`
          }}
        >
          <FaRegSnowflake className="text-red-600" style={{ filter: 'drop-shadow(0 0 1px rgba(220, 38, 38, 0.6))' }} />
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: var(--snowflake-opacity, 0.6);
          }
          85% {
            opacity: var(--snowflake-opacity, 0.6);
          }
          100% {
            transform: translateY(100vh) translateX(var(--wobble)) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes wobble {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(var(--wobble));
          }
        }

        .animate-fall {
          animation: fall 12s linear infinite !important;
        }
      `}</style>
    </div>
  );
};

export default Snowflakes;
