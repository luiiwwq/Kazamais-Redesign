# Simulador de materiais

## Atualização: nove materiais e faces locais

Este bloco substitui os detalhes antigos conflitantes abaixo (mantidos como histórico de validação).

- Todos os nove produtos podem ser selecionados no controle **Expositor**. Troca realmente a face/padrão visível no Canvas; não atribui piso/parede. Deep links sem aplicação confirmada abrem nesse modo. Formato proporcional, escala de apresentação ajustada, sem alegação de espessura real. Mobiliário é ocultado no modo expositor para não intersectar o pedestal.
- Aplicações confirmadas continuam sendo dois pisos/três paredes, sem alteração de contratos técnicos. Slug inexistente gera aviso. Reset também oculta expositor. Orçamento e ficha acompanham o produto efetivamente selecionado.
- Seis faces do mapa auditado: Monte, Artsy, Santa Diamond, Minimalismo, Thor e Classic. Importadas localmente, nunca imagens `room`; canvas até 2048² limitado à resolução original. Santa Diamond tem apenas 450²: não há detalhe de alta resolução inventado. Faces incluem iluminação fotografada, não são PBR calibrado; relevo não é geometria medida.
- Madero, Monterrey e Savoy não têm face isolada identificada no contrato: padrões originais procedurais de 512², distintos por aparência. Foto ambientada é referência HTML, nunca textura. Falha de carregamento de face mantém padrão procedural. Color maps sRGB, anisotropia limitada à GPU e a 8, repetição/orientação por instância, descarte no cleanup e proteção contra callback após unmount.
- Ambiente procedural local de iluminação capturado uma vez em 64², luz direcional/sombras existentes, mobiliário com cantos arredondados, almofadas com sheen, pés e elemento vegetal. Sem HDR remoto, física, segundo renderer ou pós-processamento. Não constitui fotorrealismo/fotometria. Mantém demand loop e pausas; não promete FPS ou economia medida.
- Resultados atuais em UPDATE-QA.md. Registros abaixo são da implementação anterior.

## Escopo e entrada

Implementação isolada em `src/components/simulator/`; export default em `Simulator.tsx`. Reutiliza a página `/simulador`, os dados e `useSelection`, sem alterar contratos, dependências ou estilos globais.

Deep links: `/simulador?produto=classic-white-deco` aplica à parede; `/simulador?produto=madero-jatoba-externo` aplica ao piso (primeira superfície confirmada na base). Um slug inexistente, sem superfície confirmada ou sem dimensões gera explicação; não é aplicado automaticamente. Alterações de material são locais, sem reload ou remontagem do Canvas. O reset limpa materiais e orientações de ambas as superfícies, câmera e luz, mas não limpa o orçamento nem altera a URL; abrir novamente o deep link reaplica o produto.

## Fidelidade e limites dos dados

- A base oficial em `src/data/index.ts` oferece **dois pisos e três paredes**: Madero Jatobá, 24,5 × 100 cm, piso/parede; Monterrey Cement, 108 × 108 cm, piso/parede; Classic White Deco, 72 × 72 cm, somente parede.
- Ambas as superfícies alternam independentemente entre base cenográfica e produtos compatíveis. Listagens e contagens derivam de `surfaces` e requerem dimensões; Classic não é oferecido para piso.
- Formatos comerciais oficiais são usados, não dimensões de fabricação. Para Madero, 24,5 × 100 cm não deve ser confundido com 245 × 995 mm de fabricação. Aplicação confirmada não elimina restrições de uso, acabamento e instalação descritas na ficha.
- Cena em metros: sala 4,80 × 4,20 m, altura 2,80 m. Parede posterior inteira aplicada; laterais/janela são cenográficas. A abertura lateral tem 2,00 × 1,40 m e peitoril a 0,90 m. Sofá com largura aproximada de 2,25 m e mesa de diâmetro 1,30 m fornecem referência de escala.
- Paginação reta: UVs dividem largura/altura da superfície pelo formato comercial em metros **mais junta ilustrativa de 0,003 m** em cada eixo. Madero a 0° no piso repete `4,80/(0,245+0,003)` por `4,20/(1+0,003)`; a 90° troca os denominadores. Na parede a altura é 2,80 m. A espessura visual da junta é calculada separadamente por eixo, evitando distorção em peças retangulares. Bordas recortadas não são cálculo executivo de paginação, compra ou perdas.
- Texturas procedurais locais de 512² pixels, sRGB, sem fotografias ou solicitações externas. Madeira: veios longitudinais marrons; cimento: manchas e granulação cinza de baixa amplitude com semente determinística; relevo ilustrativo: desenho direcional claro com gradientes, sem displacement, normal map ou geometria exata de relevo. Cor não é uma cor técnica verificada. Junta ilustrativa de 3 mm não é especificação de instalação.
- Materiais de tecido, madeira, cerâmica e bases cenográficas são diferenciados por cor e rugosidade, mas não constituem simulação fotométrica. Luz quente/neutra é estudo visual, sem alegação de temperatura calibrada.
- Orientação independente por superfície. Rotação 90° troca largura/comprimento de peças retangulares e gira o desenho; peças quadradas mantêm modulação. No piso, o comprimento a 0° acompanha a profundidade da sala. Seleção de outra superfície não altera o material ou orientação da anterior. Novos produtos exigem revisão visual, mesmo com elegibilidade derivada dos dados.

## Interação, recursos e acessibilidade

- Poster SVG estático embutido e local antes do clique; importação lazy de Scene/Canvas somente após iniciar.
- Presets ambiente, parede e piso; rotação limitada a ±25° em slider HTML acessível por teclado. Sem OrbitControls, autorotate, captura de scroll ou gesto obrigatório.
- Sem animações contínuas ou transições de câmera: alterações discretas também respeitam usuários com reduced-motion. Estilos globais já suprimem transições nesse modo.
- `frameloop="demand"`; `never` fora da viewport ou com documento oculto. IntersectionObserver e eventos removidos ao desmontar.
- DPR entre 1 e 1,5; reduz a 1 após quatro submissões de render que excedem 28 ms. É uma heurística de custo **CPU de submissão**, não medição GPU/FPS, e não há subida automática. Sem pós-processamento, física ou dependência remota de HDR.
- Materiais/geometrias declarativos pertencem ao R3F. CanvasTexture criada em efeito e descartada no cleanup, incluindo troca de produto/orientação. Apenas uma luz projeta sombras de 1024².
- Após o clique, um probe WebGL2 detecta indisponibilidade antes de carregar Three; o contexto de teste é liberado imediatamente. Error boundary cobre falha do carregamento/render React. `webglcontextlost` desmonta a cena e mostra poster com tentativa manual; Canvas também inclui fallback. Seleção e orçamento são HTML independentes da cena. Tentativa manual preserva os materiais atuais.
- Integração de orçamento usa `has`, `toggle`, `ready`, `storageError`. Não envia pedidos nem inventa preços. Persistência e limitações são as do provider existente.

## Verificações executadas

- `npm run typecheck`: passou após esta atualização.
- `npm run build`: passou, incluindo geração estática de `/simulador`.
- `node --experimental-strip-types src/components/simulator/smoke.cjs`: passou em Chromium headless com servidor de produção local na porta 3217. Teste encerra navegador/servidor. Node emitiu aviso `MODULE_TYPELESS_PACKAGE_JSON` ao importar o helper TypeScript; não alteramos o manifesto fora do escopo para suprimi-lo.
- Testes numéricos do helper `materials.ts`: três formatos, duas superfícies e duas orientações; verificam pitches comerciais + junta e repetições em escala. Verificam também as três famílias procedurais.
- Desktop **1440 × 1000**, tablet **820 × 1180**, mobile **390 × 844**: três materiais de parede, dois de piso, independência de material/orientação, todos os presets, luz quente/neutra, limites de rotação por teclado, reset de ambas as superfícies/orientações/câmera/luz, orçamento preservado e ausência de overflow horizontal.
- Capturas do Canvas em memória verificam mudança de pixels entre materiais, orientação da madeira, câmeras e luzes. Contador de navegação, marcador no documento e identidade do elemento Canvas comprovam troca sem reload/navegação/remontagem. Isso não equivale a uma revisão estética por imagem de referência.
- Perda de contexto acionada pela extensão real `WEBGL_lose_context` nos três tamanhos: fallback, troca de material em fallback, recuperação manual e navegação à ficha correta passaram.
- WebGL indisponível simulado com `getContext` retornando null somente para solicitações GL: poster/fallback sem Canvas, nova tentativa, troca de material e orçamento funcionaram. Deep links de parede e piso também verificados.
- Console e pageerror: nenhum erro nas execuções de navegador.

## Pendente / não comprovado

Não executados: Safari/Firefox, dispositivo móvel físico, leitura com leitor de tela, falha física do driver GPU, medição de memória GPU, benchmark térmico e auditoria visual fotométrica. A indisponibilidade é simulada no contrato do navegador e a perda de contexto usa extensão de teste, não falha física de GPU. Pausa por visibilidade e heurística DPR foram implementadas, mas não instrumentadas pelo smoke. Capturas verificam mudanças de pixels, não fidelidade ao fabricante; cores, variações de faces, acabamento, relevo e assentamento continuam ilustrativos.
