import type { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Una plataforma completa de comercio electrónico con carrito de compras, pasarela de pago y panel de administración.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    githubUrl: "https://github.com/usuario/ecommerce",
    demoUrl: "https://ecommerce-demo.com"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Aplicación para gestión de tareas con arrastrar y soltar, categorías y recordatorios.",
    technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/usuario/taskapp",
    demoUrl: "https://taskapp-demo.com"
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "Dashboard meteorológico con visualización de datos en tiempo real y pronósticos.",
    technologies: ["React", "TypeScript", "Chart.js", "OpenWeather API"],
    githubUrl: "https://github.com/usuario/weather-dash",
    demoUrl: "https://weather-dash-demo.com"
  }
];