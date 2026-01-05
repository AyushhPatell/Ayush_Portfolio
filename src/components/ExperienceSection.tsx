import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

const experiences = [
  {
    company: 'MacGregor Industrial Group',
    role: 'Application Developer',
    period: 'May - August 2025',
    location: 'Halifax, Canada',
    achievements: [
      'Built and upgraded business web applications using modern web technologies and content management systems',
      'Developed enterprise applications using Microsoft Access, SharePoint, and VBA to streamline workflows across three manufacturing divisions',
      'Collaborated closely with business stakeholders to understand requirements and implement solutions that improved usability',
      'Conducted thorough testing and quality assurance, collected user feedback, and iterated on designs',
    ],
    techStack: ['SharePoint', 'Azure', 'React', 'VBA', 'Microsoft Access'],
    color: 'from-vibrant-purple to-vibrant-purple-light',
  },
  {
    company: 'Canada Revenue Agency',
    role: 'IT Analyst',
    period: 'September - December 2024',
    location: 'Summerside, PEI',
    achievements: [
      'Provided technical support and troubleshooting for web-based applications and online tools',
      'Analyzed existing digital systems and workflows to identify inefficiencies and developed automated solutions',
      'Developed PowerShell and Java automation scripts for routine system tasks, including file processing and data validation workflows, while employing root cause analysis and structured debugging to resolve technical issues',
      'Served as primary point of contact for government staff technical issues, achieving high first-call resolution rates',
      'Provided technical assistance and training on Windows OS, MS Office 365, and various government applications',
    ],
    techStack: ['Power BI', 'MS Office 365', 'SharePoint', 'Azure', 'SQL'],
    color: 'from-tech-blue to-tech-cyan',
  },
];

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="experience"
      ref={ref}
      className="min-h-screen py-20 px-6 bg-gradient-to-br from-elegant-dark via-deep-navy to-deep-blue relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-40 right-40 w-96 h-96 bg-elegant-gold rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-elegant-teal rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gradient-gold">The Journey</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-elegant-gold to-elegant-teal mx-auto" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-elegant-gold via-elegant-teal to-elegant-gold transform md:-translate-x-1/2" />

          {/* Experience Cards */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-6 h-6 bg-gradient-to-br from-elegant-gold to-elegant-teal rounded-full border-4 border-elegant-dark transform md:-translate-x-1/2 z-10 shadow-lg shadow-elegant-gold/50" />

                {/* Card */}
                <div className={`w-full md:w-5/12 ml-20 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="glass-strong rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-elegant-gold/20 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-gradient-gold transition-colors">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 text-vibrant-purple-light font-semibold mb-2">
                          <Briefcase size={18} />
                          <span>{exp.company}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{exp.period}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <span className="text-elegant-gold mt-1.5">▹</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {exp.techStack.map((tech) => (
                        <span
                          key={tech}
                          className={`px-3 py-1 bg-gradient-to-r ${exp.color} rounded-full text-xs font-semibold text-white`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;

