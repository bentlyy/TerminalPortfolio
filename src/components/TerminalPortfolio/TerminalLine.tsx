import { motion } from 'framer-motion';
import type { LineType } from '../../types';

interface Props {
  text: string;
  type: LineType;
}

export default function TerminalLine({ text, type }: Props) {
  const colors: Record<LineType, string> = {
    command: "text-green-400",
    output: "text-gray-300",
    error: "text-red-400",
    info: "text-blue-400",
    success: "text-green-300"
  };

  return (
    <motion.div 
      className={`${colors[type]} whitespace-pre-wrap font-mono text-sm`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {text}
    </motion.div>
  );
}