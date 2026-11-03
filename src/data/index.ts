/** Fontes e decisões por campo: docs/DATA-AUDIT.md. Não é ficha de instalação. */
export interface Product {
  slug: string;
  name: string;
  brand?: string;
  reference?: string;
  description: string;
  appearance?: string;
  /** Formato em centímetros; não inclui espessura nem embalagem. */
  dimensions?: { width: number; height: number };
  finish?: string;
  images: { src: string; alt: string; kind: 'room' | 'tile' }[];
  source: string;
  notes: string[];
  /** Vazio significa não confirmado, não significa proibido. */
  surfaces: ('floor' | 'wall')[];
  /** Texto de cor documentada; vazio significa não verificada. Não é token CSS. */
  color: string;
}

export interface Store {
  name: string;
  address?: string;
  phone?: string;
  hours?: string;
  source: string;
}

const root = 'https://kazamais.com.br/blog/';
const upload = `${root}wp-content/uploads/2022/06/`;
const source = (slug: string): string => `${root}produto/${slug}/`;
const image = (file: string, alt: string, kind: 'room' | 'tile'): Product['images'][number] => ({ src: upload + file, alt, kind });
const rights = 'Uso das informações e assets Kazamais autorizado pelo usuário para este projeto. Essa autorização relatada não constitui licença independente de fabricantes ou fotógrafos; URL pública não é licença.';

export const products: Product[] = [
  {
    slug: 'monte-saint-michez-fendi', name: 'Monte Saint Michez Fendi', brand: 'Castelli', reference: '73003',
    description: 'Porcelanato acetinado com reprodução de cimento.', appearance: 'Cimento',
    dimensions: { width: 123, height: 123 }, finish: 'Acetinado',
    images: [image('73003-Monte-Saint-Michez-Fendi-F1-1.jpg', 'Face do Monte Saint Michez Fendi, referência 73003', 'tile'), image('Monte-Saint-Michez-Fendi-73003.jpg', 'Ambiente Monte Saint Michez Fendi publicado pela Kazamais', 'room')],
    source: source('monte-saint-michez-fendi'),
    notes: [rights, 'Marca e formato 123 × 123 da referência 73003 confirmados apenas na Kazamais.', 'Pesquisa oficial em https://castelliporcelanato.com.br/produtos e POST https://castelliporcelanato.com.br/transaction/Product/list (title=Monte, site=castelli, status=1): Monte Saint Michez Fendi id 391 tem código CA120003, formato 122 × 122, acetinado e Piso/Parede explícitos. Não transferidos para 73003: equivalência entre referências não comprovada.', 'LD e Junta Piso isolados não foram interpretados como autorização de aplicação.'], surfaces: [], color: '',
  },
  {
    slug: 'artsy-cement', name: 'Artsy Cement', brand: 'Portobello', reference: '24614E',
    description: 'Porcelanato esmaltado com reprodução de concreto.', appearance: 'Concreto', dimensions: { width: 90, height: 90 },
    images: [image('revenda-24614-e-artsy-artsy-cement-pol-90x90-ret-0.jpg', 'Face Artsy Cement identificada como 24614E POL na fonte', 'tile'), image('productGroupColor_1083_24614_pbl_amb_artsy_cement_90x90_pol_ret_01-scaled.jpg', 'Ambiente Artsy Cement 24614 polido, conforme identificação da fonte', 'room')],
    source: source('artsy-cement'), notes: [rights, 'Acabamento omitido: descrição/categoria dizem acetinado, arquivos da referência 24614 indicam POL; galeria mistura NAT 24613 e POL 24614.', 'Consulta às rotas tentativas Portobello retornou 404; conflito não resolvido oficialmente.'], surfaces: [], color: '',
  },
  {
    slug: 'ladrilho-ceramico-villagres-santa-diamond-natural', name: 'Santa Diamond Natural', reference: 'CV252550',
    description: 'Ladrilho cerâmico de geometria 3D e reprodução de cimento.', appearance: 'Cimento', dimensions: { width: 25, height: 25 }, finish: 'Natural',
    images: [image('20_5_2_252_PV321_Diamond_F5.webp', 'Face Diamond publicada na ficha Santa Diamond Natural', 'tile')],
    source: source('ladrilho-ceramico-villagres-santa-diamond-natural'),
    notes: [rights, 'Marca omitida: home/slug indicam Villagres; ficha informa Ceramicasa. Site Ceramicasa apresentou erro de transporte.', 'Imagem Blackwood-01 da home excluída por identidade incompatível.', 'Formato 25 × 25 confirmado no campo Formato; terceira dimensão de 20 cm não é espessura.'], surfaces: [], color: '',
  },
  {
    slug: 'minimalismo-bruto-gr', name: 'Minimalismo Bruto GR', brand: 'Portinari', reference: '62233',
    description: 'Porcelanato natural inspirado na aparência do concreto e no minimalismo.', appearance: 'Concreto', dimensions: { width: 100, height: 100 }, finish: 'Natural',
    images: [image('MINIMALISMOBRUTOGR100X100-1-scaled.jpg', 'Face Minimalismo Bruto GR 100 × 100', 'tile'), image('V1227.jpg', 'Ambiente publicado na ficha Minimalismo Bruto GR', 'room')],
    source: source('minimalismo-bruto-gr'), notes: [rights, 'Formato confirmado na home e dimensões da ficha Kazamais; sem validação independente Portinari. https://www.ceramicaportinari.com.br/ e seus robots.txt/sitemap.xml retornaram HTTP 403 na pesquisa oficial.', 'Embalagem informa 1 m² e duas peças de 100 × 100; inconsistência não incorporada.'], surfaces: [], color: '',
  },
  {
    slug: 'madero-jatoba-externo', name: 'Madero Jatobá', brand: 'Villagres', reference: '2481A',
    description: 'Porcelanato de reprodução de madeira, com marcas de serra e relevo expressivo.', appearance: 'Madeira', dimensions: { width: 24.5, height: 100 }, finish: 'Externo',
    images: [image('2481-Madero_Jatoba_1645121607-1.jpg', 'Ambiente Madero Jatobá publicado pela Kazamais', 'room')],
    source: source('madero-jatoba-externo'), notes: [rights, 'Ficha oficial descoberta pela busca: https://www.villagres.com.br/PT/produtos/naturale/madero/2481a — referência exibida 2481, rota 2481a, formato 24,5 × 100 cm, superfície Externo. Consultar com sessão em português via https://www.villagres.com.br/language/pt-BR.', 'Resolvido: home 24,5 × 100 versus ficha Kazamais 25 × 100; adotado formato comercial oficial 24,5 × 100. Dimensão de fabricação oficial 245 × 995 mm é distinta do formato comercial.', 'Aplicação oficial Local 4: ambientes externos descobertos, áreas molhadas, entorno de piscinas e rampas para pedestres até 10°, incluindo Local 1 (paredes e interior de piscina). Piso e parede confirmados por indicação e legenda vinculadas à ficha; não constitui aprovação irrestrita para qualquer ambiente.', 'Acabamento Externo oficial prevalece sobre categoria Acetinado da Kazamais.'], surfaces: ['floor', 'wall'], color: '',
  },
  {
    slug: 'monterrey-cement', name: 'Monterrey Cement', brand: 'Villagres', reference: '108009',
    description: 'Porcelanato inspirado no cimento queimado, da linha que homenageia Monterrey.', appearance: 'Cimento', dimensions: { width: 108, height: 108 }, finish: 'Natural',
    images: [image('108009-Monterrey_Cement_1645118952-1.jpg', 'Ambiente Monterrey Cement, referência 108009', 'room')],
    source: source('monterrey-cement'), notes: [rights, 'Ficha oficial descoberta pela busca: https://www.villagres.com.br/PT/produtos/metropolitana/monterrey/108009a — referência 108009, formato 108 × 108 cm, superfície Natural. Consultar com sessão em português via https://www.villagres.com.br/language/pt-BR.', 'Aplicação oficial Local 3: ambientes internos residenciais e comerciais com alto tráfego, garagens, escadas, saídas de emergência e áreas externas descobertas, exceto entorno de piscinas; inclui locais 1 e 2. Local 1 explicita paredes e interior de piscina. Piso e parede confirmados por indicação e legenda vinculadas à ficha; respeitar restrições de instalação.'], surfaces: ['floor', 'wall'], color: '',
  },
  {
    slug: 'savoy', name: 'Savoy', brand: 'Villagres', reference: '820011',
    description: 'Porcelanato com reprodução de mármore prata e veios brancos.', appearance: 'Mármore', dimensions: { width: 82, height: 141.5 },
    images: [image('820011-Savoy_Silver_1645123739.jpg', 'Ambiente Savoy Silver, referência 820011, publicado pela Kazamais', 'room')],
    source: source('savoy'), notes: [rights, 'Acabamento omitido: home e tabela dizem acetinado; descrição diz mármore prata polido. Busca oficial https://www.villagres.com.br/PT/busca?search=820011 não encontrou dados; pesquisa Savoy também não trouxe ficha. Acervo https://www.villagres.com.br/PT/produto/f?nameOrCod=820011 recebeu o filtro, mas consulta Livewire retornou HTTP 405; sem validação de aplicação.', 'Nome mantido como Savoy; arquivos usam Savoy Silver.'], surfaces: [], color: 'Prata com veios brancos',
  },
  {
    slug: 'thor-sand', name: 'Thor Sand', brand: 'Portobello', reference: '12750E',
    description: 'Porcelanato esmaltado com reprodução de pedra.', appearance: 'Pedra', dimensions: { width: 80, height: 80 },
    images: [image('revenda-12750-e-thor-thor-sand-ext-80x80-ret-11.jpg', 'Face Thor Sand 12750E identificada como EXT 80 × 80 na fonte', 'tile')],
    source: source('thor-sand'), notes: [rights, 'Acabamento omitido: categoria/descrição acetinado versus arquivo EXT. Sem ficha oficial validada.', 'Fotos ambientadas 60 × 60 e 30 × 60 excluídas para não atribuir outro formato à referência 80 × 80.', 'Oferta e pronta entrega da home não representam disponibilidade atual verificada.'], surfaces: [], color: '',
  },
  {
    slug: 'classic-white-deco', name: 'Classic White Deco', brand: 'ViaRosa', reference: 'AR72056',
    description: 'Porcelanato acetinado monocolor com relevo 3D, indicado pelo fabricante para paredes.', appearance: 'Monocolor, relevo 3D', dimensions: { width: 72, height: 72 }, finish: 'Acetinado',
    images: [
      { src: 'https://viarosa.com.br/wp-content/uploads/2025/07/ar-72056-classic-white-deco-face-1-1024x1024.jpg', alt: 'Face Classic White Deco AR72056 com relevo 3D', kind: 'tile' },
      { src: 'https://viarosa.com.br/wp-content/uploads/2025/07/ar-72056-classic-white-deco-ar-72080-classic-white-ambiente-alta.jpg', alt: 'Ambiente com Classic White Deco AR72056 e Classic White AR72080; não representa apenas o Deco', kind: 'room' },
    ], source: source('classic-white-deco'),
    notes: [rights, 'Validação oficial: https://viarosa.com.br/produtos/classic-white-deco/ — AR72056, 72 × 72 cm, aplicação Parede, LF paredes internas, externas e fachadas.', 'Original: home 72 × 72 versus ficha 75 × 75; adotado 72 × 72 oficial. Foto principal AR72000 da Kazamais excluída por outra referência.', 'Espessura Kazamais 10 mm versus oficial 11 mm; não exposta no contrato.'], surfaces: ['wall'], color: '',
  },
];

export const stores: Store[] = [
  { name: 'Unidade Paulínia / SP', address: 'Av José Paulino, 4640, Pq. Brasil 500.', phone: '(19) 3874.1701', hours: 'Segunda a sexta-feira 9h às 18h; sábado 9h às 13h', source: root },
  { name: 'Unidade Itapira / SP', address: 'Av. Castro Alves, 507, Boa Vista.', phone: '(19) 3813.1904', hours: 'Segunda a sexta-feira 9h às 18h; sábado 9h às 13h', source: root },
  { name: 'Unidade Jaguariúna / SP', address: 'Rua Amazonas, 960, Jd. Dom Bosco.', phone: '(19) 3867.1195', hours: 'Segunda a sexta-feira 9h às 18h; sábado 9h às 13h', source: root },
  { name: 'Unidade Valinhos / SP', address: 'Av. Invernada, 2187, Pq. Nova Suíça.', phone: '(19) 3244.3001', hours: 'Segunda a sexta-feira 9h às 18h; sábado 9h às 13h', source: root },
];
