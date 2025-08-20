import { useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal } from './useTerminal';
import { useTerminalActions } from '../../hooks/useTerminalActions';
import TerminalLine from './TerminalLine';
import ProjectCard from '../UI/ProjectCard';
import ThreeJSBackground from '../UI/ThreeJSBackground/ThreeJSBackground';

export default function TerminalPortfolio() {
  const { lines, currentView, projectsData, handleCommand } = useTerminal();
  const { state, minimize, close } = useTerminalActions();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Desplazamiento automático al fondo del terminal
  useEffect(() => {
    if (terminalRef.current && state === 'open') {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines, state]);

  // Focus en el input al hacer clic en cualquier parte del terminal
  useEffect(() => {
    if (state !== 'open') return;

    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener('click', handleClick);
      return () => terminal.removeEventListener('click', handleClick);
    }
  }, [state]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = e.currentTarget.value.trim().toLowerCase();
      if (command) {
        handleCommand(command);
        e.currentTarget.value = '';
      }
    }
  };

  // Si la terminal está cerrada, mostrar solo el fondo de Three.js
  if (state === 'closed') {
    return (
      <>
        <ThreeJSBackground isVisible={true} />
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#5eff5a',
          fontFamily: 'monospace',
          textAlign: 'center',
          zIndex: 10
        }}>
          <h1>Terminal Cerrada</h1>
          <p>Presiona F5 para reiniciar</p>
        </div>
      </>
    );
  }

  // Si la terminal está minimizada, mostrar solo un botón para restaurar
  if (state === 'minimized') {
    return (
      <>
        <ThreeJSBackground isVisible={true} />
        <button
          onClick={() => window.location.reload()}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            background: '#2a3041',
            color: '#5eff5a',
            border: '1px solid #343c51',
            borderRadius: '5px',
            fontFamily: 'monospace',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          Restaurar Terminal
        </button>
      </>
    );
  }

  // Terminal en estado normal (abierta)
  return (
    <>
      <ThreeJSBackground isVisible={false} />
      <div className="terminal-container">
        {/* Barra de título con botones funcionales */}
        <div className="terminal-header">
          <div className="terminal-buttons">
            <div 
              className="terminal-button close" 
              onClick={close}
              style={{ cursor: 'pointer' }}
              title="Cerrar terminal"
            ></div>
            <div 
              className="terminal-button minimize" 
              onClick={minimize}
              style={{ cursor: 'pointer' }}
              title="Minimizar terminal"
            ></div>
            <div 
              className="terminal-button maximize"
              style={{ cursor: 'pointer', opacity: 0.5 }}
              title="Maximizar (no disponible)"
            ></div>
          </div>
          <div className="terminal-title">Bienvenidos</div>
        </div>
        
        {/* Contenido principal */}
        <div className="terminal-content">
          <div 
            ref={terminalRef}
            className="terminal-output"
          >
            {/* Líneas de terminal */}
            {lines.map((line, index) => (
              <TerminalLine key={index} text={line.text} type={line.type} />
            ))}
            
            {/* Vistas específicas */}
            <AnimatePresence>
              {currentView === 'projects' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="projects-view"
                >
                  <div className="view-title"># Mis Proyectos</div>
                  <div className="projects-grid">
                    {projectsData.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Input de comandos */}
          <div className="terminal-input-container">
            <span className="terminal-prompt">$</span>
            <input
              ref={inputRef}
              type="text"
              onKeyDown={handleKeyDown}
              className="terminal-input"
              placeholder="Escribe un comando..."
              autoFocus
            />
          </div>
          
          {/* Ayuda rápida */}
          <div className="terminal-help">
            <span>Comandos: </span>
            {['help', 'projects', 'about', 'contact', 'clear', 'home'].map(cmd => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
                className="terminal-command-button"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}