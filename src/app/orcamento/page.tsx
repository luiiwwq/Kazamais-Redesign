import { Quote } from '@/components/quote';
export const metadata={title:'Minha seleção',description:'Prepare seu briefing de materiais e copie um resumo para conversar com a loja.',robots:{index:false,follow:true}};
export default function Page(){return <div className="wrap section"><header className="page-heading"><h1>Seu projeto, em seleção.</h1><p>Organize materiais, áreas e perguntas. O próximo passo é uma conversa, não uma compra automática.</p></header><Quote/></div>;}
