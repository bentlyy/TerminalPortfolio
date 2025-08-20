import { useState } from 'react';
import type { TerminalState } from '../types';

export const useTerminalActions = () => {
  const [state, setState] = useState<TerminalState>('open');

  const minimize = () => {
    setState('minimized');
  };

  const maximize = () => {
    setState('open');
  };

  const close = () => {
    setState('closed');
  };

  return {
    state,
    minimize,
    maximize,
    close
  };
};