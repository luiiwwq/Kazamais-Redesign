# Kazamais

Aplicação Next.js App Router + TypeScript, com catálogo editorial baseado em `src/data/index.ts`. Não é ecommerce: não cobra, não envia pedidos e não apresenta estoque ou preços fictícios.

## Executar

Requer Node.js 20.9+ (validado com Node 24.21.0) e npm.

```sh
npm ci
npm run dev
```

Abra **http://localhost:3000**. O servidor de desenvolvimento permanece no terminal; use outro terminal para verificações ou encerre-o antes de iniciar produção na mesma porta.

```sh
npm run typecheck
npm run build
npm start
```

**Simulador integrado:** `/simulador` importa o componente real `src/components/simulator/Simulator.tsx` dentro de `Suspense`. Build e typecheck foram aprovados na revalidação pós-QA. Consulte `docs/SIMULATOR.md` para controles, deep links, escala, texturas ilustrativas, fallback WebGL e limitações. Não é uma representação fotométrica nem ficha de instalação.

Versões instaladas no lockfile: Next 16.4.4, React/React DOM 19.3.1, Three 0.182.0, R3F 9.8.2 e Drei 10.7.9. Peer dependencies consultadas antes da instalação: R3F 9 aceita React >=19 e <19.4; Drei 10 aceita React 19 e R3F 9. Não há segundo renderer, física ou pós-processamento adicionados por esta implementação.

## Rotas e comportamento

- `/`: direção editorial arquitetônica, fotos locais, acesso ao simulador pelo material do hero, índice de aparências com filtros verificáveis, percurso para profissionais e diretório das quatro unidades.
- `/revestimentos`: busca por nome/ref (sem distinção de acentos), filtros por marca/aparência/acabamento/aplicação confirmada, parâmetros URL, ordenação, contagem, estado vazio e comparação de até três referências.
- `/revestimentos/[slug]`: nove fichas estáticas, metadata individual, galeria e zoom em dialog nativo, notas de conflito, fontes, embalagem a confirmar e relacionados.
- `/ambientes`, `/profissionais`, `/lojas`: inspiração, orientação de especificação e contatos publicados. Ligações/mapas só abrem por ação do visitante.
- `/orcamento`: seleção local, áreas opcionais, notas por item, unidade e resumo copiável. Sem envio ao servidor. Falha do clipboard oferece cópia manual.
- `/simulador`: estudo visual 3D sob demanda, com materiais e orientações independentes por superfície, presets de câmera, luz, reset e fallback; orçamento continua utilizável sem WebGL.
- `sitemap.xml`, `robots.txt`, 404 e boundary de erro. Redirecionamentos locais de `/blog`, `/blog/produto/:slug`, `/blog/product/:slug`, `/produto/:slug` e `/produtos`.

Filtros não inferem propriedades de fotografias. `surfaces: []` significa não confirmado, e não proibido. Comparação e seleção de orçamento são estados independentes. Campos em conflito são explicitados na ficha, sem estimar caixas, espessuras ou rendimento.

A base atual confirma **dois pisos e três paredes**: Madero Jatobá e Monterrey Cement têm piso/parede; Classic White Deco tem somente parede. Opções de aplicação do catálogo derivam dos dados, e a comparação mostra todas as superfícies de cada produto. As restrições das fichas continuam válidas. Exemplos locais: `/revestimentos?aplicacao=floor`, `/revestimentos?aplicacao=wall` e `/simulador?produto=madero-jatoba-externo`.

## Seleção compartilhada

`src/components/selection.tsx` exporta `SelectionProvider` e `useSelection()`:

```ts
items: { slug: string; area: string; notes: string }[]
toggle(slug: string): void
has(slug: string): boolean
// Também disponíveis: update, ready, storageError.
```

Provider global no layout. Slugs desconhecidos e duplicados são descartados na leitura do localStorage. Chaves: `kazamais-selection-v1` e `kazamais-unit`. Persistência limitada ao navegador; não há sincronização entre dispositivos. Não inserir dados sensíveis em notas. Nenhuma autenticação ou autorização foi simulada.

Itens, áreas e notas são sincronizados entre abas da mesma origem por eventos `storage` e atualização ao retornar o foco. Cada mutação relê o estado persistido e aplica apenas sua intenção: remover não adiciona, e editar não recria um item removido. Patches de campos distintos são preservados; duas edições do mesmo campo seguem a ordem de gravação (a última vence). Web Locks serializa leitura/alteração/gravação entre abas em navegadores compatíveis, incluindo Chromium em localhost/HTTPS. Sem Web Locks há rebase síncrono, mas não garantia transacional contra gravações exatamente simultâneas. A unidade de preferência continua sendo uma preferência local recuperada ao abrir a página, não participa da sincronização de itens. Se o armazenamento falhar, um aviso orienta copiar o resumo; alterações permanecem apenas na memória da sessão.

## Imagens e fontes

- `docs/DATA-AUDIT.md`: histórico de fontes, validações e decisões que fundamentam a base atual, incluindo as confirmações oficiais incorporadas durante o projeto. Consulte em conjunto com `src/data/index.ts`.
- `src/lib/product-images.ts`: imports estáticos de 13 imagens associadas às URLs auditadas.
- `docs/IMAGE-MAP.md`: proveniência, arquivo local e SHA-256.
- `scripts/audit-assets.ts`: reproduz a comparação binária com o acervo, baixa apenas imagens necessárias e gera o mapa. `npm run assets:audit` requer rede e pode atualizar exclusivamente mapa, relatório e cópias auditadas.
- Assets originais preservados. Logo oficial e fachada importados do acervo.

As novas cópias não coincidiram byte a byte com os originais. A escolha de manter versões separadas evita supor que nomes numéricos identifiquem a mesma referência. Correspondência binária/proveniência não certificam cor, adequação técnica nem direitos de uso. Autorização comercial de imagens e marca permanece pendente.

## Design e acessibilidade

`DESIGN.md` registra as escolhas; tokens executáveis em `src/app/globals.css`. Georgia editorial + Trebuchet MS humanista, com fallbacks locais. Sem dependência de Google Fonts. Teclado, foco visível, skip-link, menu mobile, Escape e restauração de foco nos dialogs; reduced-motion remove animações. Sem biblioteca de ícones: ações têm rótulos textuais.

## Testes

```sh
npx playwright install chromium
npm run test:e2e
node --experimental-strip-types src/components/simulator/smoke.cjs
```

`npm run test:e2e` inicia/reutiliza o servidor local na porta 3000. **Nove testes aprovados** em Chromium: navegação incluindo simulador, nove fichas, imagens, 404, redirect, busca, filtros de dois pisos/três paredes, comparação completa, ordenação, vazio, teclado, persistência, falha de armazenamento e mobile. Regressões multiaba cobrem sincronização, edição atrasada após remoção e patches concorrentes de área/nota sob Web Lock. Evidências em `test-results/` (ignoradas no Git).

O smoke do simulador requer `npm run build` antes e a porta **3217 livre**; ele inicia e encerra seu servidor de produção local. Passou nos três tamanhos documentados em `docs/SIMULATOR.md`, incluindo perda de contexto/retry e indisponibilidade WebGL. O aviso Node `MODULE_TYPELESS_PACKAGE_JSON` não impediu a execução. Esses testes não são uma auditoria WCAG completa, Lighthouse nem certificação de fidelidade visual. Não há chamadas ou envio de mensagens comerciais.

## Antes de publicar

1. Manter build, typecheck, testes multiaba e smoke WebGL/fallback aprovados após qualquer nova alteração.
2. Definir `NEXT_PUBLIC_SITE_URL` para o domínio real. Sem configuração, usa localhost, sem inventar domínio de produção.
3. Obter autorização de imagens/marca e validar informações comerciais e técnicas.
4. Definir `SITE_INDEXABLE=true` somente após aprovação de publicação. Padrão: noindex e robots bloqueado. Orçamento permanece noindex.
5. Executar testes em produção, Safari/Firefox, dispositivos reais e auditorias de acessibilidade/desempenho proporcionais.

Não há deploy, migração de banco, envio de formulário comercial ou mudança de permissões do ambiente incluídos nesta entrega. O catálogo incorpora as atualizações documentadas da auditoria de dados; os ajustes da home consomem essa base sem modificá-la.
