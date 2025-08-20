import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

export default function NeonParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 5 + 3
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="neon-particles">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="neon-particle"
          initial={{ 
            opacity: 0,
            x: `${particle.x}%`,
            y: `${particle.y}%`
          }}
          animate={{ 
            opacity: [0, 0.7, 0],
            y: [`${particle.y}%`, `${particle.y - 20}%`]
          }}
          transition={{ 
            duration: particle.duration,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}
    </div>
  );
}