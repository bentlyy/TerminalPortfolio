import { motion } from 'framer-motion';
import type { LineType } from '../../types';

interface Props {
  text: string;
  type: LineType;
}

export default function TerminalLine({ text, type }: Props) {
  const getClassName = () => {
    switch (type) {
      case 'command': return 'text-command';
      case 'output': return 'text-output';
      case 'info': return 'text-info';
      case 'error': return 'text-error';
      case 'success': return 'text-success';
      default: return 'text-output';
    }
  };

  return (
    <motion.div 
      className={`terminal-line ${getClassName()}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {text}
    </motion.div>
  );
}