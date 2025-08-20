import { useRef, useEffect, useState } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal } from './useTerminal';
import { useTerminalActions } from '../../hooks/useTerminalActions';
import TerminalLine from './TerminalLine';
import ProjectCard from '../UI/ProjectCard';
import ThreeJSBackground from '../UI/ThreeJSBackground/ThreeJSBackground';
import MovingCar from '../MovilCar/MovingCar';
import NeonParticles from '../NeonParticles/NeonParticles';

// Definimos un tipo para las claves de comandos
type CommandKey = 'Ayuda' | 'Proyectos' | 'Sobre-mi' | 'Contacto' | 'Limpiar' | 'Inicio';

// Comandos en español con primera letra en mayúscula
const COMMAND_CONFIG = {
  'Ayuda': { 
    internalCommand: 'help',
    description: 'Muestra todos los comandos disponibles'
  },
  'Proyectos': { 
    internalCommand: 'projects',
    description: 'Muestra mis proyectos de desarrollo'
  },
  'Sobre-mi': { 
    internalCommand: 'about',
    description: 'Información personal y experiencia'
  },
  'Contacto': { 
    internalCommand: 'contact',
    description: 'Medios para contactarme'
  },
  'Limpiar': { 
    internalCommand: 'clear',
    description: 'Limpia la terminal'
  },
  'Inicio': { 
    internalCommand: 'home',
    description: 'Vuelve al estado inicial'
  }
};

// Función type guard para verificar si una clave es válida
function isValidCommandKey(key: string): key is CommandKey {
  return key in COMMAND_CONFIG;
}

const AVAILABLE_COMMANDS: CommandKey[] = Object.keys(COMMAND_CONFIG) as CommandKey[];

export default function TerminalPortfolio() {
  const { lines, currentView, projectsData, handleCommand } = useTerminal();
  const { state, minimize, close } = useTerminalActions();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState<CommandKey[]>(AVAILABLE_COMMANDS);
  const [inputValue, setInputValue] = useState('');

  // Scroll automático solo si estamos al final
  useEffect(() => {
    if (!terminalRef.current || state !== 'open') return;

    const container = terminalRef.current;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;

    if (isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [lines, state]);

  // Focus al hacer click en el terminal
  useEffect(() => {
    if (state !== 'open') return;
    const handleClick = () => inputRef.current?.focus();
    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener('click', handleClick);
      return () => terminal.removeEventListener('click', handleClick);
    }
  }, [state]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = inputValue.trim();
      if (command) {
        // Buscar si el comando existe (case insensitive)
        const matchedCommand = AVAILABLE_COMMANDS.find(
          cmd => cmd.toLowerCase() === command.toLowerCase()
        );
        
        if (matchedCommand && isValidCommandKey(matchedCommand)) {
          // Ejecutar el comando interno correspondiente
          handleCommand(COMMAND_CONFIG[matchedCommand].internalCommand);
        } else {
          // Si no se encuentra, mostrar error
          handleCommand(`error: Comando "${command}" no encontrado. Escribe "Ayuda" para ver los comandos disponibles.`);
        }
        
        setInputValue('');
        setShowSuggestions(false);
      }
    }
    if (e.key === 'ArrowDown') {
      // opcional: navegar en sugerencias
      e.preventDefault();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      const filtered = AVAILABLE_COMMANDS.filter(cmd => 
        cmd.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCommands(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCommands(AVAILABLE_COMMANDS);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (cmd: CommandKey) => {
    if (isValidCommandKey(cmd)) {
      // Ejecutar el comando interno correspondiente
      handleCommand(COMMAND_CONFIG[cmd].internalCommand);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  if (state === 'closed') {
    return (
      <>
        <ThreeJSBackground isVisible={true} />
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          color: '#5eff5a', fontFamily: 'monospace', textAlign: 'center', zIndex: 10
        }}>
          <h1>Terminal Cerrada</h1>
          <p>Presiona F5 para reiniciar</p>
        </div>
      </>
    );
  }

  if (state === 'minimized') {
    return (
      <>
        <ThreeJSBackground isVisible={true} />
        <button
          onClick={() => window.location.reload()}
          style={{
            position: 'fixed', bottom: '20px', right: '20px',
            padding: '10px 20px', background: '#2a3041', color: '#5eff5a',
            border: '1px solid #343c51', borderRadius: '5px', fontFamily: 'monospace',
            cursor: 'pointer', zIndex: 1000
          }}
        >
          Restaurar Terminal
        </button>
      </>
    );
  }

  return (
    <>
      <ThreeJSBackground isVisible={false} />
      <div className="terminal-container">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <div className="terminal-button close" onClick={close}></div>
            <div className="terminal-button minimize" onClick={minimize}></div>
            <div className="terminal-button maximize" style={{ opacity: 0.5 }}></div>
          </div>
          <div className="terminal-title">Bienvenidos</div>
        </div>

        <div className="terminal-content">
          <div ref={terminalRef} className="terminal-output">
            {lines.map((line, index) => (
              <TerminalLine key={index} text={line.text} type={line.type} />
            ))}
            <div ref={terminalRef} className="terminal-output">
            <NeonParticles />
            {lines.map((line, index) => (
              <TerminalLine key={index} text={line.text} type={line.type} />
            ))}
          </div>
            <MovingCar linesCount={lines.length} />
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

          <div className="terminal-input-container" style={{ position: 'relative' }}>
            <span className="terminal-prompt">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="terminal-input"
              placeholder="Escribe un comando..."
              autoFocus
            />
            
            <AnimatePresence>
              {showSuggestions && filteredCommands.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="terminal-suggestions"
                >
                  {filteredCommands.map(cmd => (
                    <div
                      key={cmd}
                      className="suggestion-item"
                      onMouseDown={() => handleSuggestionClick(cmd)}
                    >
                      {cmd}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}