# Atualização de interface — 2026-11-03

## Refinamento final — concluído e verificado

Esta seção substitui as pendências visuais e contagens das rodadas históricas abaixo. Preservadas todas as alterações existentes; sem delegação, commit/push ou mudanças em configurações de agentes.

### Mudanças efetivas
| Antes | Depois | Evidência |
|---|---|---|
| Madero procedural quase uniforme | 16 faces oficiais com fibras, nós/marcas de serra e variação entre peças | `compare-1440-madero-jatoba-externo.png`, `compare-390-madero-jatoba-externo.png` |
| Monterrey procedural granular | 3 faces oficiais únicas, manchas suaves e textura cimentícia | `compare-1440-monterrey-cement.png`, `compare-390-monterrey-cement.png` |
| Savoy procedural escuro com desenho repetitivo | 8 faces oficiais claras com veios finos e direções distintas | `compare-1440-savoy.png`, `compare-390-savoy.png` |
| Rugosidade escalar, luz/sombra anteriores | Bump/roughness derivados artisticamente, luz de janela/fill recalibrados, sombra ajustada e contato estático 256² | Mesmos seis pares de captura; limites abaixo |
| Thumbnail selecionada ainda grafite; foco nativo podia persistir no mouse | Borda mineral; modalidade pointer/keyboard cobre select/dialog autofocus sem blur | Teste de estados ampliado aprovado |

### Fontes e imagens
28 arquivos dos ZIPs oficiais efetivamente baixados, 27 distintos usados. Manifest, dimensões, hashes e contact sheets em `docs/evidence/official-faces.json` e `*-official-contact-sheet.png`. Todas as contact sheets inspecionadas. Ver DATA-AUDIT para URLs reais, busca Savoy/404/ZIP e distinção entre asset e indicação técnica. Fontes limitadas a 510–600 px no maior eixo; não se afirma alta resolução inexistente. Nenhuma imagem de ambiente usada como textura.

### Comparação controlada
Seis capturas antes e seis depois, mesmo viewport, câmera Ambiente, ângulo 0°, luz neutra e produto aplicado às duas superfícies. Arquivos persistentes em `docs/evidence/`; montagens `compare-*` têm antes à esquerda e depois à direita. **Todos os seis pares foram abertos e inspecionados**, incluindo os três materiais em mobile. Observação: variação por peça e textura de madeira agora visíveis; cimento sem aspecto de ruído pontilhado; Savoy com escala/tonalidade/veios próximos às faces oficiais, sem trama procedural repetitiva. Sombra de contato discreta sob mobiliário, sem novo pós-processamento.

`compare-refinement.cjs` mediu diferenças RGB médias absolutas em recortes fixos de piso/parede, registradas em `refinement-comparison.json`. Desktop: Madero parede 14,26/piso 25,02; Monterrey 30,06/40,72; Savoy 49,43/29,25. Mobile: Madero 13,99/27,16; Monterrey 31,11/44,92; Savoy 49,52/31,01. Esses números comprovam mudança observável, **não qualidade, fidelidade fotométrica ou segmentação semântica**.

### Revisão global dos controles
Lidos componentes header, gallery, quote, catalog, selection, store-map e simulador; buscadas regras inline/escopadas e inspecionadas CSSRules efetivas de globals.css e Simulator.module.css. Corrigidos override de thumbnail selecionada, estados disabled, hover de campos, foco em superfícies escuras e persistência nativa de foco no mouse. `InteractionModality` escuta pointerdown/keydown em capture, sem impedir eventos, mover foco ou atrasar teclado; limpa listeners no unmount. CSS sem JS mantém foco-visible padrão como fallback.

Teste cobre hover, mouse-down/active, foco teclado e dimensões de: Minha seleção, buscar, search, filtros select, ordenar, card-link, checkbox, botão selecionar, comparação/fechar, galeria/thumbnail selecionada, summary, zoom/fechar, reset, material select, range, orientação, orçamento, number, textarea, select de unidade, textarea readonly, copiar, mapa/fechar, menu mobile e link de navegação. O teste suprime somente o clique de ativação durante inspeção para não navegar/remover/fechar; ações reais são executadas separadamente. Nenhum outline no mouse, nenhuma sombra preta; foco teclado solid preservado. Evidências de foco em `test-results/focus-*.png`.

### Verificações finais executadas
- `npm run test:e2e`: **14/14 aprovados**, aproximadamente 1,2 min, incluindo nove deep links, falha de uma face do atlas oficial, cancelamento de imagem, dialogs, navegação e regressões de seleção.
- `npm run typecheck`: aprovado.
- Dev encerrado antes de `npm run build`: aprovado, 20 páginas.
- Smoke de produção após build: **PASS 1440×1000, 820×1180, 390×844**, nove materiais em ambas superfícies; independência/orientação, câmera/luz, sem reload/remount, reset, context loss/retry, fallback indisponível e orçamento. Console/pageerror: **errors=[]**.
- Scripts de pesquisa, download/auditoria, capture before/after e compare executados. Não houve instalação de dependências; sharp existente reutilizado somente nas ferramentas de auditoria/evidência.
- Dev reiniciado após build/smoke; `/` e `/simulador` retornaram **HTTP 200**. `git diff --check` sem erros de whitespace (avisos LF/CRLF). `next-env.d.ts` sem diferença final após reiniciar dev. Captura final tablet `test-results/room-820.png` e foco de menu mobile também abertas e inspecionadas.

### Limites reais, não pendências de implementação
Não há alegação de fotorrealismo calibrado, cores medidas, altura real do relevo, instalação aprovada ou PBR medido. Roughness/bump são aproximações de luminância explicitadas na interface. Fontes são 147×600/510×510/343×600; atlas não cria detalhe. Uma textura única ainda repete nos demais seis materiais; múltiplas faces só foram adicionadas onde efetivamente obtidas. Atlases também repetem em áreas grandes. ContactShadows captura uma vez porque o mobiliário é estático; não modela iluminação global. Limites de 2048 para cor, 512 para dados, DPR 1–1,5, demand/pause/lazy preservados; sem benchmark GPU/FPS/memória ou teste térmico. Sem Safari/Firefox, dispositivo físico ou auditoria WCAG integral. Aviso Node MODULE_TYPELESS_PACKAGE_JSON não fatal permanece.

Skills aplicadas: r3f-materials, r3f-textures, r3f-lighting, emil-design-eng, ui-craft e referência accessibility, já lidas nesta sessão. Sem renderer adicional, física ou pós pesado.

## Histórico: superfícies diretas e tabelas completas (antes do refinamento final)

Git estava limpo no início. Sem delegação, commit/push, novas dependências ou mudanças nas configurações de agentes. Histórico abaixo descreve versões anteriores e não o comportamento atual.

| Antes | Depois | Motivo |
| --- | --- | --- |
| Nove amostras em expositor, superfície limitada por indicação | Nove materiais no piso e parede reais, sem expositor | Estudo livre solicitado, sem inventar indicação técnica |
| Material confirmado | Material / estudo visual, avisos de uso não verificado e Classic no piso | Separar experimentação e especificação |
| Tabelas omitidas por conflito | Tabelas publicadas completas, notas e dados conciliados separados | Preservar fonte sem corrigir valores silenciosamente |
| Juntas sempre 3 mm | Junta do campo técnico publicado, fallback 3 mm | Escala coerente com fonte, sem calculadora |
| Bordas grafite e foco externo | Bordas neutras estáveis, hover mineral, foco interno de 2 px | Remover efeito preto e preservar teclado sem corte |

### Evidência executada nesta revisão
- `npm run test:e2e`: **13/13 aprovados**, 57,5 s. Inclui falha de asset com callback cancelado, comparação, rotas, storage, teclado, reduced-motion, mobile e estados de interação.
- `npm run typecheck`: aprovado.
- `npm run build`: aprovado, 20 páginas, com dev encerrado antes da execução.
- `node --experimental-strip-types src/components/simulator/smoke.cjs`: aprovado em 1440×1000, 820×1180 e 390×844. Todos os nove materiais em ambas superfícies, diferenças de capturas, sem reload/remount; independência de materiais/orientação, câmera, iluminação, reset, orçamento, context loss/retry e WebGL indisponível. Console capturado: `errors=[]`.
- `git diff --check`: sem erros de whitespace; avisos LF/CRLF do ambiente.
- Dev reiniciado após build/smoke; fetch local retornou HTTP 200 em `/` e `/simulador`. `next-env.d.ts` voltou ao conteúdo original após inicialização do dev.
- ComputedStyle de hover/active e teclado em Minha seleção, Buscar, input busca, link limpar, card, fechar dialog, reset, selecionar orçamento, área e notas. Teste verifica ausência de sombra preta, bordas não pretas, foco teclado e dimensões estáveis. Inputs de texto podem manter `:focus-visible` mesmo com mouse por comportamento nativo; nesse caso foco mineral, nunca preto.
- Inspecionadas `test-results/room-1440.png`, `room-820.png`, `room-390.png`, `floor-1440-madero-jatoba-externo.png`, `wall-1440-monte-saint-michez-fendi.png`, `focus-form.png`, `focus-dialog.png`. Sala sem expositor, materiais efetivamente nas superfícies, layouts sem overflow. Madeira procedural ainda tem aparência uniforme; realismo não está concluído.
- Falhas intermediárias corrigidas: nome acessível do seletor Material; seletor exato do teste Aplicação; min-width global de tabela causando overflow mobile. Suíte final passou após correções.

### Limites e pendências de aceite
Não afirmar conclusão integral do refinamento visual: não foram incorporadas faces oficiais maiores/múltiplas faces, nem novos mapas de normal/roughness. A iluminação existente foi preservada, não houve nova calibração de sombras. Busca oficial real e miniaturas inspecionadas estão em DATA-AUDIT. Procedurais de 1024² melhorados, porém sem equivalência fotográfica comprovada. Não há bloqueio técnico para continuar essa etapa; ela permanece trabalho pendente.

Teste de estados cobre representantes de componentes, não cada elemento individual nem todo select nativo. Smoke compara arquivos de screenshot, não regiões segmentadas de cada malha. Deep links testados incluem Classic, Madero, Monte e Savoy; não nove navegações individuais. Sem Safari/Firefox, hardware móvel, auditoria WCAG completa ou benchmark GPU. Aviso Node MODULE_TYPELESS_PACKAGE_JSON permanece não fatal. Avisos Next de imagem LCP/proporção apareceram numa execução intermediária e não foram tratados como erro de console de produção.

Skills lidas: r3f-materials, r3f-textures, r3f-lighting, emil-design-eng e ui-craft (original e referência accessibility). Aplicadas proporcionalmente à stack existente, recursos próprios, sRGB, descarte, demand, foco e reduced-motion. Nenhum renderer/physics/postprocessing adicionado.

## Histórico anterior

## Correção pós-QA: estado real das texturas

Achado médio corrigido: a presença de uma face no catálogo não é mais apresentada como prova de carregamento. `Surface` reporta `loading`, `ready`, `error` ou `procedural` para cada produto/superfície. A interface HTML contém `role="status"`, `aria-live="polite"` e o nome do produto; falha de imagem informa explicitamente **Fallback procedural ilustrativo em uso; não reproduz a peça real**. Sucesso só é anunciado após a face carregar e a textura ser criada. Antes de iniciar o 3D e durante indisponibilidade existem mensagens próprias. A fotografia HTML permanece uma referência independente, sem alegar sucesso da textura.

Relatórios são associados a slot (expositor/piso/parede), slug e orientação. Troca/orientação sem relatório correspondente mostra carregamento, não sucesso anterior. Cleanup remove handlers de imagem, invalida callbacks atrasados, descarta a textura e limpa o relatório; nova tentativa também limpa os estados. Piso e parede mantêm relatórios independentes mesmo quando exibem o mesmo produto.

Teste novo em `tests/enhancements.spec.ts`: instala interceptação **após carregar a página**, segura e aborta apenas a face raw `/_next/static/media/monte-saint-michez-fendi-0*.jpg`; verifica carregando → erro/fallback, ausência de falsa afirmação de sucesso, Canvas ainda presente e respondendo à luz por mudança de pixels, seleção de orçamento funcional, sucesso de Classic, nova tentativa de Monte em carregamento e troca para Savoy antes da resposta abortada (sem estado stale). A imagem HTML otimizada e os chunks JS não são bloqueados. O erro de rede induzido é esperado; nenhum `pageerror` ocorreu.

Verificações desta correção: `npm run typecheck` aprovado; `npm run build` aprovado (20 páginas); `npx playwright test tests/enhancements.spec.ts` **3/3 aprovados em 15,6 s**; smoke do simulador aprovado nos três tamanhos, nove materiais/pixels, fallback WebGL e recuperação, **errors=[]**. Aviso Node `MODULE_TYPELESS_PACKAGE_JSON` permanece não fatal. `git diff --check` sem erros de whitespace (avisos LF/CRLF do ambiente). Não foi reexecutada a suíte completa de catálogo nesta correção localizada. `next-env.d.ts` restaurado após regeneração automática. Sem commit/push.

## Escopo executado

Git inicialmente limpo. Sem delegação, instalação de dependências, alteração de contratos técnicos, commit/push ou deploy. Next 16.4.4, React 19, Three 0.182, Fiber 9 e Drei 10 existentes preservados.

| Antes | Depois | Motivo |
| --- | --- | --- |
| Apenas referências com aplicação confirmada no simulador | Nove materiais realmente selecionáveis em expositor, aplicações confirmadas separadas | Explorar o acervo sem inventar indicações técnicas |
| Todas as texturas procedurais | Seis faces locais auditadas e três padrões procedurais | Mais detalhe, sem usar foto de ambiente como textura |
| Caixas rígidas no mobiliário | Cantos arredondados, almofadas, pés, sheen e iluminação de ambiente local | Melhor leitura de volume, sem física/pós-processamento |
| Ampliação podia esticar imagens pequenas | Faces contidas e zoom limitado à largura intrínseca | Não inventar resolução nem cortar faces |
| Outline nativo também no clique | Foco mineral em `:focus-visible`, sem outline no clique | Teclado continua identificável, sem layout shift |
| Mudanças abruptas de rota/dialog | Entradas CSS 180–220 ms e feedback existente | Sem interceptar links do Next; reduced-motion desliga animações |
| Mapas somente externos | Quatro previews lazy, dialog ampliado e link alternativo | Consulta sem abandonar a página |

## Dados, imagens e autorização

- Usuário autorizou informações/assets Kazamais para este projeto. Pendência Kazamais substituída nos documentos e notas públicas. Não é declaração de licença independente de terceiros.
- Consulta oficial `https://www.villagres.com.br/PT/busca?search=820011`: retornou conteúdo genérico, não ficha Savoy. `https://www.ceramicaportinari.com.br/`: HTTP 403. Nenhuma aplicação nova inferida.
- Inspeção visual das seis faces locais: Monte 2000², Artsy 1181², Diamond 450², Minimalismo 2000², Thor 801², Classic 1024². Não houve download/substituição especulativa de binários. Diamond continua de resolução limitada; não foi feito upscale artificial.
- Madeira Madero, cimento Monterrey e mármore Savoy usam padrões ilustrativos. Faces e iluminação não são PBR calibrado. A melhoria não é promessa de fotorrealismo.
- O embed público Google Maps `maps?q=...&output=embed` funcionou sem chave no Chromium. Paulínia ampliado mostrou Av. José Paulino, 4640, Parque Brasil 500, Paulínia/SP. A URL de cada unidade deriva de seu endereço/cidade confirmado. Geocodificação do provedor não equivale a confirmação por contato.

## Verificações efetivamente executadas

- `npm run build`: aprovado, 20 páginas geradas.
- `npm run typecheck`: aprovado após correção do narrowing TypeScript da dimensão capturada no callback de textura.
- `npm run test:e2e`: **11/11 aprovados**, última suíte completa em 37,8 s. Navegação, nove fichas, imagens, filtros, comparação, orçamento, persistência/multiaba, mobile, teclado e reduced-motion; novos testes cobrem deep link Savoy, nove opções, previews lazy, dialog, Escape e foco de retorno.
- `node --experimental-strip-types src/components/simulator/smoke.cjs`: aprovado em **1440×1000, 820×1180 e 390×844**. Cada um dos nove expositores comparado aos demais por pixels; 27 capturas gravadas. Independência de superfícies/orientação, luz/câmera, orçamento preservado, reset, ausência de reload/remount, contexto perdido e retry, WebGL indisponível. Console/pageerror: `errors=[]`. Aviso Node `MODULE_TYPELESS_PACKAGE_JSON` não fatal.
- `git diff --check`: sem erros de whitespace; avisos de conversão LF/CRLF do ambiente.
- Após o ajuste de recorte do skip-link fora de foco, build/typecheck e os dois testes de melhorias foram reexecutados e passaram (2/2, 8,3 s). `next-env.d.ts`, reescrito automaticamente pelo build, foi restaurado ao conteúdo inicial; manifest/lockfile não alterados.
- Screenshots inspecionados via leitura de imagem: `sample-1440-classic-white-deco.png`, `sample-1440-savoy.png`, `room-390.png`, `room-1440.png`, `map-expanded.png`, `stores-mobile.png`. Corrigida interseção pedestal/mesa (mobiliário oculto no expositor) e adicionado carregamento do mapa após primeira inspeção. Captura posterior comprovou mapa Paulínia carregado. Previews fora da viewport podem estar vazios na captura full-page por serem lazy.
- Evidências em `test-results/`, ignoradas no Git. Scripts/testes versionáveis permitem reprodução.

## Limitações

Sem ensaio fotométrico, desempenho GPU/FPS/memória medido, Safari/Firefox, dispositivo físico, leitor de tela ou auditoria WCAG integral. A heurística DPR mede submissão CPU, não GPU. Não há animação contínua de cena nem interpolação de câmera: controles continuam instantâneos. Serviço externo de mapas pode ser bloqueado ou indisponível; endereço/link alternativo permanecem visíveis. `onLoad` de iframe não comprova sucesso interno cross-origin. Previews consultam Google automaticamente ao aproximar-se da viewport, informado na interface; requisitos de consentimento devem ser avaliados antes de publicar. Não foram verificados direitos independentes de fabricantes/fotógrafos.

## Skills lidas

`emil-design-eng`, `r3f-materials`, `r3f-lighting`, `r3f-textures`, `ui-craft` (adaptador e arquivo original vendor). Aplicada a identidade existente de DESIGN.md; sem outro sistema visual ou coleção Three.js concorrente.
