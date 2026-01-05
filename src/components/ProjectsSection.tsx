import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Github, CheckCircle, Lock } from 'lucide-react';

const projects = [
  {
    title: 'MyHub - AI Powered Academic Dashboard',
    description:
      'A full-stack personal academic dashboard web application designed to help students manage their courses, assignments, schedules, and academic life in one centralized, intelligent platform.',
    features: [
      'Real-time data synchronization via Firebase',
      'AI-powered assistant using OpenAI API',
      'Course and assignment management',
      'Weather widget integration',
      'Advanced search functionality',
      'Responsive dark theme UI',
    ],
    techStack: ['React', 'TypeScript', 'Firebase', 'OpenAI API', 'Tailwind CSS'],
    liveUrl: 'https://myhub-d0f5a.web.app',
    githubUrl: '#',
    color: 'from-vibrant-purple to-vibrant-purple-light',
    bgGradient: 'from-vibrant-purple/20 to-tech-cyan/20',
    featured: true,
  },
  {
    title: 'Student Observation Tool',
    description:
      'A responsive web application for student data management and observation tracking, developed for Dalhousie University.',
    features: [
      'User authentication, registration and login features',
      'Content management features',
      'Data backup functionality',
      'Comprehensive testing procedures',
      'API endpoint validation',
    ],
    techStack: ['PHP', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Docker'],
    liveUrl: null,
    githubUrl: null,
    color: 'from-tech-blue to-tech-cyan',
    bgGradient: 'from-tech-blue/20 to-tech-cyan/20',
    featured: false,
    confidential: true,
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="projects"
      ref={ref}
      className="min-h-screen py-20 px-6 bg-gradient-to-br from-deep-navy via-deep-blue to-vibrant-purple/30 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-vibrant-purple rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-tech-cyan rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gradient-purple">The Portfolio Centerpiece</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-vibrant-purple to-neon-cyan mx-auto" />
          <p className="text-xl text-gray-400 mt-4">Projects that showcase my skills and passion</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
                className="glass-strong rounded-2xl p-8 h-full shadow-2xl overflow-hidden relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-gradient-purple transition-colors">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-vibrant-purple to-tech-cyan rounded-full text-xs font-semibold text-white mb-3">
                          Featured Project
                        </span>
                      )}
                      {project.confidential && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-tech-blue to-tech-cyan rounded-full text-xs font-semibold text-white mb-3">
                          <Lock size={14} />
                          Code Confidential
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">
                      {project.confidential ? 'Key Features I worked on:' : 'Key Features:'}
                    </h4>
                    <ul className="space-y-2">
                      {project.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={hoveredIndex === index ? { opacity: 1, x: 0 } : { opacity: 0.8, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <CheckCircle size={16} className="text-vibrant-purple mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className={`px-3 py-1 bg-gradient-to-r ${project.color} rounded-full text-xs font-semibold text-white`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${project.color} rounded-full font-semibold text-white shadow-lg hover:shadow-2xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink size={18} />
                        View Live Project
                      </motion.a>
                    )}
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 glass rounded-full font-semibold text-white hover:bg-white/20 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github size={18} />
                        GitHub
                      </motion.a>
                    )}
                    {project.confidential && (
                      <div className="flex items-center gap-2 px-6 py-3 glass rounded-full font-semibold text-gray-400">
                        <Lock size={18} />
                        Proprietary Project
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

