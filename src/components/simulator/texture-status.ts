export type TextureSlot = 'floor' | 'wall' | 'sample';
export type TextureState = 'loading' | 'ready' | 'error' | 'procedural';
export type TextureReport = { slug: string; rotated: boolean; state: TextureState };
export type ReportTexture = (slot: TextureSlot, report: TextureReport | null) => void;
