import type { StaticImageData } from 'next/image';
import m0 from '@/assets/images/audited/madero-official-0.jpg';
import m1 from '@/assets/images/audited/madero-official-1.jpg';
import m2 from '@/assets/images/audited/madero-official-2.jpg';
import m3 from '@/assets/images/audited/madero-official-3.jpg';
import m4 from '@/assets/images/audited/madero-official-4.jpg';
import m5 from '@/assets/images/audited/madero-official-5.jpg';
import m6 from '@/assets/images/audited/madero-official-6.jpg';
import m7 from '@/assets/images/audited/madero-official-7.jpg';
import m8 from '@/assets/images/audited/madero-official-8.jpg';
import m9 from '@/assets/images/audited/madero-official-9.jpg';
import m10 from '@/assets/images/audited/madero-official-10.jpg';
import m11 from '@/assets/images/audited/madero-official-11.jpg';
import m12 from '@/assets/images/audited/madero-official-12.jpg';
import m13 from '@/assets/images/audited/madero-official-13.jpg';
import m14 from '@/assets/images/audited/madero-official-14.jpg';
import m15 from '@/assets/images/audited/madero-official-15.jpg';
import c0 from '@/assets/images/audited/monterrey-official-0.jpg';
import c1 from '@/assets/images/audited/monterrey-official-1.jpg';
import c2 from '@/assets/images/audited/monterrey-official-2.jpg';
import s0 from '@/assets/images/audited/savoy-official-0.jpg';
import s1 from '@/assets/images/audited/savoy-official-1.jpg';
import s2 from '@/assets/images/audited/savoy-official-2.jpg';
import s3 from '@/assets/images/audited/savoy-official-3.jpg';
import s4 from '@/assets/images/audited/savoy-official-4.jpg';
import s5 from '@/assets/images/audited/savoy-official-5.jpg';
import s6 from '@/assets/images/audited/savoy-official-6.jpg';
import s7 from '@/assets/images/audited/savoy-official-7.jpg';

// Lazy scene dependency; no request before the user starts 3D. See audit hashes.
// Monterrey's fourth ZIP entry is byte-identical to the first, not a fourth unique face.
export const officialFaces: Record<string, StaticImageData[]> = {
  'madero-jatoba-externo': [m0,m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,m15],
  'monterrey-cement': [c0,c1,c2],
  savoy: [s0,s1,s2,s3,s4,s5,s6,s7],
};
