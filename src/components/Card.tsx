"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CardProps {
    i: number;
    title: string;
    description: string;
    src: string;
    color: string;
}

export default function Card({ i, title, description, src, color }: CardProps) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });
    const scale = useTransform(scrollYProgress, [0, 1], [2, 1]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <div style={{ backgroundColor: color, top: `calc(${i * 50}px)` }} className="flex flex-col relative min-h-[400px] w-[90vw] max-w-[1000px] rounded-[25px] px-[20px] py-[5px] transform-origin-top">
                <h2 className="font-bold text-gray-400 m-0 text-2xl">{title}</h2>
                <div className="flex flex-col md:flex-row h-full mt-12 gap-12">
                    <div className="w-full md:w-3/5 relative top-0">
                        <p className="text-base">
                            {description}
                        </p>
                    </div>
                    <div className="relative w-full md:w-2/5 h-[200px] rounded-2xl overflow-hidden hidden md:block">
                        <motion.div style={{ scale }} className="w-full h-full relative">
                            <Image
                                fill
                                src={`/images/cardstack/${src}`}
                                alt="image"
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
