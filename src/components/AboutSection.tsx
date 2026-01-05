import { motion, useInView, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import AyushImage from "./Ayush.jpeg";


const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen py-20 px-6 bg-gradient-to-br from-deep-navy via-vibrant-purple/20 to-deep-blue relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-vibrant-purple rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-tech-cyan rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gradient-purple">Who I am?</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-vibrant-purple to-neon-cyan mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Photo Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <TiltCard>
              <div className="glass-strong rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-vibrant-purple/20 to-tech-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <img src={AyushImage} alt="Ayush Patel" className="w-full aspect-square object-cover rounded-xl mb-6"/>
                  <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-vibrant-purple/50 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Right: About Text & Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                I am a fourth year Applied Computer Science student at Dalhousie University who bridges the gap between technical excellence and real-world impact. I have experience at the Canada Revenue Agency as IT Analyst and at the MacGregor Industrial Group as Application Developer. I don't just write code - I build practical solutions that streamline workflows and solve genuine business problems.
              </p>
            </div>

            {/* Animated Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass rounded-xl p-6 border-l-4 border-vibrant-purple"
            >
              <p className="text-xl font-medium text-white italic">
                "The Practical Problem Solver and Developer Who Bridges Technology and Usability"
              </p>
            </motion.div>

            {/* Key Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="glass rounded-lg p-4 text-center group hover:bg-white/10 transition-all duration-300">
                <div className="text-3xl font-bold text-gradient-purple mb-2">2</div>
                <div className="text-sm text-gray-400">Internships</div>
              </div>
              <div className="glass rounded-lg p-4 text-center group hover:bg-white/10 transition-all duration-300">
                <div className="text-3xl font-bold text-gradient-purple mb-2">4th</div>
                <div className="text-sm text-gray-400">Year Student</div>
              </div>
            </motion.div>

            {/* What I Do */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">What I Do</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-300">
                  <span className="text-vibrant-purple mt-1.5">▹</span>
                  <span>Build full-stack web applications with modern technologies</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <span className="text-vibrant-purple mt-1.5">▹</span>
                  <span>Develop enterprise solutions that improve business workflows</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <span className="text-vibrant-purple mt-1.5">▹</span>
                  <span>Focus on user experience, accessibility, and practical problem-solving</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <span className="text-vibrant-purple mt-1.5">▹</span>
                  <span>Collaborate with stakeholders to deliver solutions that matter</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

