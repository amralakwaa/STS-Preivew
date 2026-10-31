'use client';
import { motion, useReducedMotion } from 'framer-motion';

/** A heading that pulls into focus word by word when it scrolls into view, like a lens finding its subject. */
export default function FocusText({ text, as = 'h2', className = '' }: { text: string; as?: 'h2' | 'h3' | 'p'; className?: string }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(' ');
  return (
    <Tag
      key={text}
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ staggerChildren: 0.07 }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={
            reduce
              ? { hidden: { opacity: 1 }, shown: { opacity: 1 } }
              : { hidden: { opacity: 0, filter: 'blur(12px)', y: '0.35em', scale: 1.06 }, shown: { opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 } }
          }
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}{i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  );
}
