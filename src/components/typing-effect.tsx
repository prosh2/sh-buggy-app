"use client"

import { motion } from 'framer-motion';
import * as React from 'react';

export function TypingEffect({ text = 'Typing Effect' }: { text: string }) {
    const ref = React.useRef(null);
    return (
        <span
            ref={ref}
            className="text-sm text-center sm:text-md font-bold tracking-tighter md:text-lg md:leading-[4rem]"
        >
            {text.split('').map((letter, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                    {letter}
                </motion.span>
            ))}
        </span>
    );
}