import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './MovingCar.css';

interface MovingCarProps {
  linesCount: number;
}

export default function MovingCar({ linesCount }: MovingCarProps) {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [isBoosting, setIsBoosting] = useState(false);

  useEffect(() => {
    if (linesCount > 12) {
      setIsVisible(false);
      return;
    } else {
      setIsVisible(true);
    }

    const interval = setInterval(() => {
      setPosition(prev => {
        const speed = isBoosting ? 4 : 2;
        const newPosition = prev + direction * speed;
        
        if (newPosition >= 92) {
          setDirection(-1);
          setIsBoosting(true);
          setTimeout(() => setIsBoosting(false), 1000);
          return 92;
        } else if (newPosition <= 0) {
          setDirection(1);
          setIsBoosting(true);
          setTimeout(() => setIsBoosting(false), 1000);
          return 0;
        }
        
        return newPosition;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [direction, linesCount, isBoosting]);

  // Efecto de partículas de neón
  const particles = [];
  if (isBoosting) {
    for (let i = 0; i < 5; i++) {
      particles.push(
        <motion.div
          key={i}
          className="boost-particle"
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={{ 
            opacity: 0, 
            x: direction > 0 ? -20 : 20, 
            y: Math.random() * 10 - 5 
          }}
          transition={{ duration: 0.5 }}
        />
      );
    }
  }

  if (!isVisible) return null;

  return (
    <motion.div 
      className="moving-car"
      style={{ left: `${position}%` }}
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      <div className="car-container">
        <div className="car-body">
          <div className="car-top"></div>
          <div className="car-bottom"></div>
          <div className="car-details">
            <div className="car-window"></div>
            <div className="car-headlight"></div>
            <div className="car-taillight"></div>
          </div>
          <div className="car-wheel front-wheel"></div>
          <div className="car-wheel back-wheel"></div>
          <div className="car-exhaust"></div>
        </div>
        
        {/* Efecto de turbo/boost con estilo condicional */}
        {isBoosting && (
          <motion.div 
            className="car-boost"
            style={{
              left: direction > 0 ? '-15px' : 'auto',
              right: direction > 0 ? 'auto' : '-15px',
              transform: direction > 0 ? 'scaleX(1)' : 'scaleX(-1)'
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
          >
            {particles}
          </motion.div>
        )}
      </div>
      
      {/* Estela de neón */}
      <motion.div 
        className="glow-trail"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.div>
  );
}