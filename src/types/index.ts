export type LineType = 'command' | 'output' | 'error' | 'info' | 'success';

export interface TerminalLine {
  text: string;
  type: LineType;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export type Command = 'help' | 'projects' | 'about' | 'contact' | 'clear' | 'home' | string;