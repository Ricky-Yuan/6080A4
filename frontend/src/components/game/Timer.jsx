import React, { useEffect, useState } from 'react';

const Timer = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  
  // Constants for SVG circle
  const CIRCLE_RADIUS = 24;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

  useEffect(() => {
    setTimeLeft(initialTime);
    setStrokeDashoffset(0);
  }, [initialTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        // Calculate new stroke dash offset
        const progress = newTime / initialTime;
        setStrokeDashoffset(CIRCLE_CIRCUMFERENCE * (1 - progress));
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, initialTime, onTimeUp, CIRCLE_CIRCUMFERENCE]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-16 h-16">
        {/* Background circle */}
        <circle
          cx="32"
          cy="32"
          r={CIRCLE_RADIUS}
          stroke="#E5E7EB"
          strokeWidth="4"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="32"
          cy="32"
          r={CIRCLE_RADIUS}
          stroke="#3B82F6"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: CIRCLE_CIRCUMFERENCE,
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.5s ease'
          }}
        />
      </svg>
      <span className="absolute text-lg font-semibold">
        {Math.max(0, timeLeft)}
      </span>
    </div>
  );
};

export default Timer; 