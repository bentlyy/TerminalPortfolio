import { useState, useCallback } from 'react';
import type { TerminalLine, Command, LineType } from '../../types';
import { projectsData } from '../../data/projects';

const initialLines: TerminalLine[] = [
  { text: "Bienvenido a mi Portafolio Terminal 🚀", type: "info" },
  { text: "Escribe 'help' para ver los comandos disponibles", type: "info" },
  { text: "Para comenzar, escribe 'home' o navega con los comandos", type: "info" },
];

export const useTerminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [currentView, setCurrentView] = useState<'terminal' | 'projects' | 'about' | 'contact'>('terminal');

  const handleCommand = useCallback((command: Command) => {
    const newLines: TerminalLine[] = [...lines, { text: `$ ${command}`, type: "command" as LineType }];
    
    switch (command) {
      case 'help':
        newLines.push(
          { text: "Comandos disponibles:", type: "output" as LineType },
          { text: "  home     - Volver al inicio", type: "output" as LineType },
          { text: "  projects - Ver mis proyectos", type: "output" as LineType },
          { text: "  about    - Información sobre mí", type: "output" as LineType },
          { text: "  contact  - Cómo contactarme", type: "output" as LineType },
          { text: "  clear    - Limpiar la terminal", type: "output" as LineType },
          { text: "  help     - Mostrar esta ayuda", type: "output" as LineType }
        );
        setCurrentView('terminal');
        break;
      
      case 'projects':
        newLines.push({ text: "Cargando proyectos...", type: "info" as LineType });
        setCurrentView('projects');
        break;
      
      case 'about':
        newLines.push(
          { text: "¡Hola! Soy un desarrollador full-stack apasionado por la tecnología.", type: "output" as LineType },
          { text: "Me especializo en crear aplicaciones web modernas y eficientes.", type: "output" as LineType },
          { text: "Tecnologías que uso frecuentemente:", type: "output" as LineType },
          { text: "  • Frontend: React, TypeScript, Tailwind CSS", type: "output" as LineType },
          { text: "  • Backend: Node.js, Python, PostgreSQL", type: "output" as LineType },
          { text: "  • Herramientas: Git, Docker, AWS", type: "output" as LineType }
        );
        setCurrentView('about');
        break;
      
      case 'contact':
        newLines.push(
          { text: "Puedes contactarme através de:", type: "output" as LineType },
          { text: "  ✉️ Email: tu.email@ejemplo.com", type: "output" as LineType },
          { text: "  💼 LinkedIn: linkedin.com/in/tu-perfil", type: "output" as LineType },
          { text: "  🐙 GitHub: github.com/tu-usuario", type: "output" as LineType },
          { text: "  🐦 Twitter: @tu-usuario", type: "output" as LineType }
        );
        setCurrentView('contact');
        break;
      
      case 'clear':
        setLines([]);
        return;
      
      case 'home':
        newLines.push({ text: "Volviendo al inicio...", type: "info" as LineType });
        setCurrentView('terminal');
        break;
      
      default:
        newLines.push(
          { text: `Comando no reconocido: ${command}`, type: "error" as LineType },
          { text: "Escribe 'help' para ver los comandos disponibles", type: "info" as LineType }
        );
    }
    
    setLines(newLines);
  }, [lines]);

  const clearTerminal = useCallback(() => {
    setLines([]);
  }, []);

  return {
    lines,
    currentView,
    projectsData,
    handleCommand,
    clearTerminal
  };
};