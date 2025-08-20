import { useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal } from './useTerminal';
import TerminalLine from './TerminalLine';
import ProjectCard from '../UI/ProjectCard';

export default function TerminalPortfolio() {
  const { lines, currentView, projectsData, handleCommand } = useTerminal();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Desplazamiento automático al fondo del terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus en el input al hacer clic en cualquier parte del terminal
  useEffect(() => {
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
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = e.currentTarget.value.trim().toLowerCase();
      if (command) {
        handleCommand(command);
        e.currentTarget.value = '';
      }
    }
  };

  return (
    <div className="terminal-container">
      {/* Barra de título */}
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button close"></div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">terminal-portfolio</div>
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
  );
}