import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const skillCategories = [
  {
    category: 'Core Programming',
    skills: ['Java', 'Python', 'TypeScript', 'SQL'],
    color: 'from-vibrant-purple to-vibrant-purple-light',
  },
  {
    category: 'Web Technologies',
    skills: ['React', 'HTML5', 'CSS', 'JavaScript', 'Tailwind CSS'],
    color: 'from-tech-blue to-tech-cyan',
  },
  {
    category: 'Tools & Platforms',
    skills: ['Git', 'Firebase', 'Docker', 'VS Code', 'Postman', 'Jira', 'IntelliJ'],
    color: 'from-elegant-teal to-tech-cyan',
  },
  {
    category: 'Microsoft Stack',
    skills: ['SharePoint', 'Power BI', 'Power Automate', 'MS Office 365', 'Microsoft SQL', 'Azure'],
    color: 'from-elegant-gold to-elegant-teal',
  },
  {
    category: 'Design & UX',
    skills: ['Figma', 'Canva', 'UI/UX Design', 'Accessibility'],
    color: 'from-vibrant-purple-light to-tech-blue',
  },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="skills"
      ref={ref}
      className="min-h-screen py-20 px-6 bg-gradient-to-br from-deep-navy via-vibrant-purple/20 to-elegant-dark relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-40 left-40 w-96 h-96 bg-vibrant-purple rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-tech-cyan rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gradient-purple">The Tech Universe</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-vibrant-purple to-neon-cyan mx-auto" />
          <p className="text-xl text-gray-400 mt-4">Technologies I work with</p>
        </motion.div>

        {/* Hexagon Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-strong rounded-2xl p-6 shadow-2xl hover:shadow-vibrant-purple/20 transition-all duration-300 relative overflow-hidden"
              >
                {/* Category Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gradient-purple transition-colors">
                    {category.category}
                  </h3>

                  {/* Skills Grid */}
                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`px-4 py-2 bg-gradient-to-r ${category.color} rounded-lg text-sm font-semibold text-white shadow-lg cursor-default`}
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center glass rounded-2xl p-8"
        >
          <p className="text-lg text-gray-300 leading-relaxed">
            I continuously expand my skill set to stay current with modern technologies and best practices.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;

