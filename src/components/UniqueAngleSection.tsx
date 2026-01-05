import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Code, Building2, Sparkles } from 'lucide-react';

const uniquePoints = [
  {
    icon: Target,
    title: 'The Practical Problem Solver',
    description:
      "I don't just code - I identify real problems and build solutions that improve workflows and user experience. Every project starts with understanding the problem, not just implementing a solution.",
    gradient: 'from-vibrant-purple to-vibrant-purple-light',
    iconColor: 'text-vibrant-purple',
  },
  {
    icon: Code,
    title: 'Developer Who Bridges Technology and Usability',
    description:
      'My focus on UX, user feedback, testing, and accessibility shows I care about the end user experience, not just making things work. I build solutions that people actually want to use.',
    gradient: 'from-tech-blue to-tech-cyan',
    iconColor: 'text-tech-cyan',
  },
  {
    icon: Building2,
    title: 'Developer Experience + Enterprise Experience',
    description:
      'I bring real-world experience with both enterprise tools and modern web technologies. This unique combination allows me to work effectively across different technology stacks and adapt to various project requirements, making me a versatile contributor to any team.',
    gradient: 'from-elegant-gold to-elegant-teal',
    iconColor: 'text-elegant-gold',
  },
];

const UniqueAngleSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="unique-angle"
      ref={ref}
      className="min-h-screen py-20 px-6 bg-gradient-to-br from-elegant-dark via-deep-navy to-vibrant-purple/30 relative overflow-hidden"
    >
      {/* Parallax Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-elegant-gold/20 via-elegant-teal/20 to-vibrant-purple/20" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-elegant-gold rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-elegant-teal rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 text-gradient-gold mx-auto" />
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gradient-gold">Why Work With Me?</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-elegant-gold to-elegant-teal mx-auto" />
          <p className="text-xl text-gray-400 mt-4">What sets me apart from other developers</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {uniquePoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                className="relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="glass-strong rounded-2xl p-8 shadow-2xl hover:shadow-elegant-gold/20 transition-all duration-300 relative overflow-hidden h-full"
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${point.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="mb-6 inline-block"
                    >
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${point.gradient} p-4 flex items-center justify-center shadow-lg`}>
                        <Icon className={`w-8 h-8 ${point.iconColor} text-white`} />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-gradient-gold transition-colors">
                      {point.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg text-gray-300 leading-relaxed">{point.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.p
            className="text-xl text-gray-300 mb-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            I bring both creativity and technical depth to every challenge, focusing on delivering tools that people actually want to use.
          </motion.p>
          <motion.a
            href="#contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-elegant-gold to-elegant-teal rounded-full font-semibold text-elegant-dark shadow-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Build Something Together
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default UniqueAngleSection;

