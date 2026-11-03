# Atualização de interface — 2026-11-03

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
