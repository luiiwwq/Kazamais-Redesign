/** Transcrição das tabelas Kazamais lidas em 2026-11-03. Valores não recalculados. */
type Row = { label: string; value: string };
const rows = (text: string): Row[] => text.split('|').map(row => { const [label, value] = row.split('='); return { label, value }; });
const technical = (text: string) => rows(text);
const packaging = (text: string) => rows(`Unidade de Medida=M2|${text}`);
export const published: Record<string, { technicalDetails: Row[]; packagingDetails?: Row[]; fieldNotes?: string[] }> = {
  'monte-saint-michez-fendi': {
    technicalDetails: technical('Código=73003|Borda=Retificado|Variação visual=V2|Reprodução=Cimento|Número de Faces=6|Locais de Uso=LD|Fabricante=Castelli|Tipologia Comercial=Acetinado|Tipo=Materiais|Junta Piso=2,00 mm|Espessura=10,50 mm'),
    packagingDetails: packaging('m2/caixa=3,02 m²|Peça/caixa=2|Peso/caixa (Udm)=76 kg|Peso/pallet (Udm)=1.520 kg|m2/pallet (mi)=65,65|Caixa/pallet (mi)=20|Peça/pallet (mi)=40'),
    fieldNotes: ['Área do pallet 65,65 publicada pela Kazamais: não corresponde a 3,02 × 20. Valor preservado, não calculado. Confirmar antes da compra.'],
  },
  'artsy-cement': {
    technicalDetails: technical('Código=24614E|Borda=Retificado|Variação visual=V2|Reprodução=Concreto|Número de Faces=20|Locais de Uso=LC|Fabricante=Portobello|Tipologia Comercial=Porcelanato esmaltado|Tipo=Materiais|Junta Piso=1,50 mm|Espessura=10,00 mm'),
    packagingDetails: packaging('m2/caixa=1.610 m²|Peça/caixa=2|Peso líquido (Udm)=36.570 kg|Peso bruto (Udm)=22.981 kg|m2/pallet (mi)=65,65|Caixa/pallet (mi)=30|Peça/pallet (mi)=60'),
    fieldNotes: ['Pontuação e pesos reproduzidos como publicados, inclusive peso bruto inferior ao líquido e área de pallet divergente. Não usar para cálculo logístico. Acetinado na descrição conflita com POL nos arquivos da referência.'],
  },
  'ladrilho-ceramico-villagres-santa-diamond-natural': {
    technicalDetails: technical('Código=CV252550|Borda=Retificado|Variação visual=V4|Reprodução=Cimento|Número de Faces=6|Locais de Uso=LC|Fabricante=Ceramicasa|Tipologia Acabamento=Natural|Tipo=Materiais|Junta Mínima=3,00 mm|Espessura=8,50 mm'),
    packagingDetails: packaging('m2/caixa=1,25 m²|Peça/caixa=20|Peso/caixa=23,39 kg|Formato=25×25 cm'),
    fieldNotes: ['Fabricante Ceramicasa na tabela; Villagres no endereço da publicação. Conflito preservado.'],
  },
  'minimalismo-bruto-gr': {
    technicalDetails: technical('Código=62233|Coeficiente de atrito=≥0,4|Variação visual=V3|Superfície=Natural|Tipo=Porcelanato|Locais de Uso=LD|Fabricante=Portinari|Produto=Minimalismo Bruto GR|Acabamento da Borda=Retificado|Junta=Seca|Espessura=9,00 mm'),
    packagingDetails: packaging('m2/caixa=1 m²|Peça/caixa=2|Peso/caixa=21,53 kg|Formato=1,00 x 1,00'),
    fieldNotes: ['1 m² por caixa e duas peças de 100 × 100 são inconsistentes; preservados como publicados, sem recalcular. Junta seca é texto da fonte, não recomendação de instalação.'],
  },
  'madero-jatoba-externo': {
    technicalDetails: technical('Código=2481A|Coeficiente de atrito=≥0,6|Variação visual=V3|Reprodução=Madeira|Número de Faces=16|Locais de Uso=LE-2|Fabricante=Villagres|Tipologia Comercial=Porcelanato esmaltado|Acabamento=Externo|Junta Piso=2,00 mm|Espessura=7 mm'),
    packagingDetails: packaging('m2/caixa=2,20 m²|Peça/caixa=9|Peso/caixa=33,10 kg|Peso/pallet=1.076,2 kg|m2/pallet=70,40|Caixa/pallet=32|Peça/pallet=288'),
    fieldNotes: ['Formato adicional Kazamais 25 × 100; formato comercial oficial usado no estudo: 24,5 × 100 cm.'],
  },
  'monterrey-cement': {
    technicalDetails: technical('Código=108009|Coeficiente de atrito=≥0,4|Variação visual=V2|Reprodução=Cimento|Número de Faces=4|Locais de Uso=LD|Fabricante=Villagres|Tipologia Comercial=Porcelanato esmaltado|Acabamento=Natural|Junta Piso=2,00 mm|Espessura=9,00 mm'),
    packagingDetails: packaging('m2/caixa=2,33 m²|Peça/caixa=2|Peso/caixa=49,50 kg|Peso/pallet=2.096,0 kg|m2/pallet=97,86|Caixa/pallet=42|Peça/pallet=84'),
  },
  savoy: {
    technicalDetails: technical('Código=820011|Coeficiente de atrito=<0,4|Variação visual=V2|Reprodução=Mármore|Número de Faces=8|Locais de Uso=LD|Fabricante=Villagres|Tipologia Comercial=Porcelanato esmaltado|Acabamento=Acetinado|Junta Piso=2,00 mm|Espessura=9,00 mm'),
    packagingDetails: packaging('m2/caixa=2,32 m²|Peça/caixa=2|Peso/caixa=49,00 kg|Peso/pallet=1.327,0 kg|m2/pallet=64,96|Caixa/pallet=28|Peça/pallet=56'),
    fieldNotes: ['Acetinado na tabela versus polido na descrição. Pesos de caixa e pallet não conciliados; mantidos como publicados.'],
  },
  'thor-sand': {
    technicalDetails: technical('Código=12750E|Borda=Retificado|Variação visual=V2|Reprodução=Pedra|Número de Faces=25|Locais de Uso=LC|Fabricante=Portobello|Tipologia Comercial=Porcelanato esmaltado|Tipo=Materiais|Junta Piso=1,50 mm|Espessura=10,00 mm'),
    packagingDetails: packaging('m2/caixa=1.910 m²|Peça/caixa=3|Peso líquido (Udm)=23.560 kg|Peso bruto (Udm)=23.843kg|m2/pallet (mi)=61.120|Caixa/pallet (mi)=32|Peça/pallet (mi)=96'),
    fieldNotes: ['Pontuação preservada da publicação. Acetinado na descrição versus EXT no arquivo da face; acabamento não conciliado.'],
  },
  'classic-white-deco': {
    technicalDetails: technical('Código=AR72056|Borda=Retificado|Variação visual=V1|Acabamento=Relevo 3D|Número de Faces=1|Locais de Uso=LA|Fabricante=ViaRosa|Tipologia Comercial=Porcelanato acetinado|Tipo=Materiais|Junta Mínima=2,00 mm|Espessura=10,00 mm'),
    fieldNotes: ['Kazamais não publica tabela de embalagem nesta página. Dimensões adicionais 75 × 75 × 1 cm e espessura 10 mm conflitam com formato 72 × 72 cm e espessura 11 mm oficiais. O estudo usa formato oficial; aplicação técnica somente em parede.'],
  },
};
