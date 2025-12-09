import React, { useEffect, useState } from 'react';
import { FaRegSnowflake } from 'react-icons/fa';

const Snowflakes = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = {
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 8 + Math.random() * 4,
        opacity: 0.5 + Math.random() * 0.5,
        size: 20 + Math.random() * 30
      };
      return snowflake;
    };

    // Create initial snowflakes
    const initialSnowflakes = Array.from({ length: 50 }, createSnowflake);
    setSnowflakes(initialSnowflakes);

    // Add new snowflakes periodically
    const interval = setInterval(() => {
      setSnowflakes(prev => [
        ...prev.slice(-100),
        createSnowflake()
      ]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {snowflakes.map(snowflake => (
        <div
          key={snowflake.id}
          className="absolute animate-fall"
          style={{
            left: `${snowflake.left}%`,
            top: '-30px',
            opacity: snowflake.opacity,
            animation: `fall ${snowflake.duration}s linear ${snowflake.delay}s infinite`,
            fontSize: `${snowflake.size}px`
          }}
        >
          <FaRegSnowflake className="text-blue-200" />
        </div>
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Snowflakes;
