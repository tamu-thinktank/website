"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import {motion, useScroll, useTransform} from 'framer-motion';

interface CardProps {
    i: number
    title: string;
    description: string;
    src: string;
    color: string;
}

export default function Card({i, title, description, src, color}: CardProps) {
    
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });
    const scale = useTransform(scrollYProgress, [0, 1], [2, 1]);
    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <div style={{ backgroundColor: color, top:`calc(${i * 50}px)`}} className="flex flex-col relative h-[500px] w-[1000px] rounded-[25px] px-[20px] py-[5px] transform-origin-top">
            <h2 className="font-bold text-gray-400 m-0 text-2xl">{title}</h2>
            <div className="flex h-full mt-12 gap-12">
                <div className="w-3/5 relative top-10">
                    <p className="text-base">
                        {description}
                    </p>
                </div>

                <div className="relative w-2/5 h-full rounded-2xl overflow-hidden">
                <motion.div style={{scale}} className="w-full h-full">
                <Image
                    fill
                    src={`/images/${src}`}
                    alt="image" 
                    className="object-cover"
                />
                </motion.div>
                </div>
            </div>
            </div>
        </div>
    )
}
