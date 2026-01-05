import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Linkedin, Github, FileText, Check } from 'lucide-react';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [emailCopied, setEmailCopied] = useState(false);

  const email = 'ayush.p@dal.ca';
  const linkedinUrl = 'https://www.linkedin.com/in/ayush-patel-955466261/';
  const githubUrl = 'https://github.com/AyushhPatell';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: email,
      action: copyEmail,
      href: `mailto:${email}`,
      gradient: 'from-tech-blue to-tech-cyan',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Ayush Patel',
      href: linkedinUrl,
      gradient: 'from-vibrant-purple to-vibrant-purple-light',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'AyushhPatell',
      href: githubUrl,
      gradient: 'from-elegant-teal to-tech-cyan',
    },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="min-h-screen py-20 px-6 bg-gradient-to-br from-deep-navy via-deep-blue to-elegant-dark relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-vibrant-purple rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-tech-cyan rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gradient">Let's Build Something Together</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-tech-cyan via-vibrant-purple to-neon-cyan mx-auto" />
          <p className="text-xl text-gray-400 mt-4">
            I'm always open to discussing new opportunities and interesting projects
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.a
                key={method.label}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={method.action ? (e) => { e.preventDefault(); method.action(); } : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-strong rounded-2xl p-6 shadow-2xl hover:shadow-vibrant-purple/20 transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div className="relative z-10 text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mb-4"
                  >
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${method.gradient} p-3 flex items-center justify-center shadow-lg mx-auto`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gradient-purple transition-colors">
                    {method.label}
                  </h3>
                  <p className="text-sm text-gray-400 break-all">
                    {method.label === 'Email' && emailCopied ? (
                      <span className="flex items-center justify-center gap-1 text-green-400">
                        <Check size={16} />
                        Copied!
                      </span>
                    ) : (
                      method.value
                    )}
                  </p>
                  {method.label === 'Email' && (
                    <span className="text-xs text-gray-500 mt-2 inline-block">Click to copy</span>
                  )}
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Download Resume Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/Resume.pdf';
              link.download = 'Ayush_Patel_Resume.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-vibrant-purple to-tech-blue rounded-full font-semibold text-white shadow-lg hover:shadow-2xl transition-all duration-300 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText size={20} />
            Download Resume
          </motion.button>
          <p className="text-gray-400 mt-4 text-sm">
            Looking forward to connecting with you!
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center text-gray-500 text-sm"
        >
          <p>© {new Date().getFullYear()} Ayush Patel. Built with React, TypeScript, and Three.js</p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;

