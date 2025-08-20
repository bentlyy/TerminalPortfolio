import { motion } from 'framer-motion';
import type { Project } from '../../types';

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <motion.div 
      className="project-card"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-technologies">
        {project.technologies.map((tech, idx) => (
          <span key={idx} className="technology-tag">
            {tech}
          </span>
        ))}
      </div>
      <div className="project-links">
        {project.githubUrl && (
          <a href={project.githubUrl} className="project-link">
            GitHub
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} className="project-link">
            Demo
          </a>
        )}
      </div>
    </motion.div>
  );
}