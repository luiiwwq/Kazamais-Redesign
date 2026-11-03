'use client';
import { useEffect } from 'react';

/** Native selects and dialog autofocus can retain :focus-visible after a mouse
 * interaction. Track actual input modality without blurring or intercepting keys. */
export function InteractionModality() {
  useEffect(() => {
    const root = document.documentElement;
    const pointer = () => { root.dataset.inputModality = 'pointer'; };
    const keyboard = (event: KeyboardEvent) => {
      if (!['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) root.dataset.inputModality = 'keyboard';
    };
    document.addEventListener('pointerdown', pointer, true);
    document.addEventListener('keydown', keyboard, true);
    return () => {
      document.removeEventListener('pointerdown', pointer, true);
      document.removeEventListener('keydown', keyboard, true);
      delete root.dataset.inputModality;
    };
  }, []);
  return null;
}
