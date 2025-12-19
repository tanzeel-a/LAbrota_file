'use client';

import { useEffect } from 'react';

export default function ClickSound() {
    useEffect(() => {
        const playSound = (e) => {
            // Check if the clicked element is a button or inside a button
            if (e.target.closest('button') || e.target.closest('.btn') || e.target.closest('.btn-icon') || e.target.closest('.btn-done')) {
                const audio = new Audio('/click.wav');
                audio.volume = 0.1; // Very low volume
                audio.play().catch(err => console.error("Audio play failed", err));
            }
        };

        window.addEventListener('click', playSound);

        return () => {
            window.removeEventListener('click', playSound);
        };
    }, []);

    return null;
}
