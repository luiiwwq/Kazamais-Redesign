import { Suspense } from 'react';
import Simulator from '@/components/simulator/Simulator';
export const metadata={title:'Simulador de materiais',description:'Explore materiais em uma representação digital ilustrativa do ambiente.',alternates:{canonical:'/simulador'}};
export default function Page(){return <div className="wrap section"><header className="page-heading"><h1>Imagine a próxima superfície.</h1><p>Uma ferramenta de estudo visual. Cores, escala e iluminação não substituem amostras e validação técnica.</p></header><Suspense fallback={<p role="status">Carregando simulador…</p>}><Simulator/></Suspense></div>;}
