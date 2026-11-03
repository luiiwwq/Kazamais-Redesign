# Implementação e verificação

Data: 2026-11-03. Escopo: código da aplicação, configuração, dependências e documentação, excluindo `src/data/**`, `src/components/simulator/**` e `docs/DATA-AUDIT.md`.

## Estado integrado após correções do FINAL-QA

Revalidação em 2026-11-03. `docs/FINAL-QA.md` permanece como registro da revisão que encontrou os defeitos; `docs/SIMULATOR.md` descreve o simulador real já integrado. Nesta correção não foram alterados os dados nem qualquer arquivo da pasta do simulador.

| Achado | Correção e evidência atual |
|---|---|
| F1: comparação omitia Piso | Todas as entradas de `surfaces` são traduzidas. Teste verifica Madero e Monterrey como `Piso, Parede`, Classic como `Parede` e Artsy como `A confirmar`. |
| F2: filtro Piso ausente | Opções derivadas das superfícies presentes nos dados. Dois pisos e três paredes confirmados; filtro de piso e URL/reload testados. |
| F3: item removido ressuscitava entre abas | Eventos storage/foco sincronizam estado sem regravar snapshots. Mutação relê o persistido dentro de Web Lock e aplica patch/intenção. Edição não recria removido; remoção atrasada é idempotente. |
| F4: documentação pré-integração | README atualizado com simulador integrado, instruções localhost/portas e política multiaba. Histórico abaixo explicitamente preservado como pré-integração. |
| F5: expectativa de uma parede | Atualizada para três paredes, incluindo após reload. A suíte volta a executar vazio, ordenação e comparação até o final. |

### Comandos executados nesta revalidação

- `npm run test:e2e`: **9/9 aprovados em 32,9 s**, Chromium com servidor de desenvolvimento. Navegação agora inclui `/simulador`. Sem `pageerror` nas rotas percorridas nem `console.error` antes da visita intencional à página 404.
- Regressão de piso/comparação: dois pisos após reload; as duas superfícies aparecem nos dois produtos aplicáveis; produto sem aplicação continua `A confirmar`.
- Regressão multiaba: adição, edição e remoção propagadas entre páginas do mesmo BrowserContext; outra página recarregada mantém a remoção.
- Regressão de estado desatualizado: eventos storage/foco deliberadamente atrasados na segunda aba; nota editada após remoção na primeira não recria Savoy, nem em memória nem no localStorage após reload.
- Regressão concorrente determinística: lock retido até duas mutações estarem na fila; área em uma aba e nota em outra preservadas nas duas abas e após reload. Não depende de acertar uma janela de tempo aleatória.
- `npm run typecheck`: **aprovado, sem erros**.
- `npm run build`: **aprovado**, compilação e geração estática de 20 páginas/artefatos, incluindo `/simulador` e nove fichas.
- `node --experimental-strip-types src/components/simulator/smoke.cjs`: **aprovado** em servidor de produção local (3217), viewports 1440 × 1000, 820 × 1180 e 390 × 844. Passaram materiais/pixels, orientações independentes, câmeras/luz, ausência de reload/remount, reset, perda de contexto/retry e fallback WebGL indisponível; `errors=[]`. Aviso Node `MODULE_TYPELESS_PACKAGE_JSON` não fatal. Script executado sem modificá-lo.

### Política de conflitos e limites atuais

Madero e Monterrey têm piso/parede; Classic somente parede: **2 pisos / 3 paredes** na base atual. Dados de aplicação não eliminam restrições técnicas da ficha. Simulador integrado utiliza os mesmos dados, com limitações ilustrativas descritas em SIMULATOR.md.

Web Locks serializa mutações dos itens entre abas da mesma origem. Patches de campos diferentes são preservados; no mesmo campo, vence a última gravação na ordem do lock. Remoção prevalece sobre edição atrasada, mas uma ação explícita de selecionar novamente pode adicionar o item. Sem Web Locks, rebase antes da gravação reduz conflitos, porém localStorage não fornece transação atômica entre abas; esse fallback não foi testado em browsers sem a API. Armazenamento bloqueado mantém modo de sessão com aviso. A preferência de unidade não foi convertida em estado sincronizado multiaba.

Não há bloqueio de build/integração pendente nesta revalidação. Permanecem gates comerciais de direitos de imagem, domínio/indexação e validação técnica; não houve deploy. Safari/Firefox, dispositivos físicos, leitor de tela, axe/Lighthouse, benchmark GPU/memória e conformidade integral não foram verificados. Nenhuma nova revisão visual completa foi alegada por estas correções funcionais.

## Histórico: execução pré-integração

Os resultados a seguir documentam o estado anterior à entrega do simulador e à ampliação das superfícies. **Não representam o estado integrado atual**, aprovado acima.

| Verificação | Resultado e alcance |
|---|---|
| Instalação npm | 92 pacotes adicionados; auditoria da instalação informou zero vulnerabilidades naquele momento. Não é auditoria de segurança completa. |
| Compatibilidade | Peer dependencies consultadas para R3F/Drei; `npm ls --depth=0` confirmou Next 16.4.4, React 19.3.1, R3F 9.8.2, Drei 10.7.9 e Three 0.182.0. |
| Imagens | Script executado: 13 respostas de imagem baixadas e mapeadas, SHA-256 registrado em IMAGE-MAP.md. Originais preservados. |
| Playwright | **5 testes aprovados**, Chromium, última execução em 33,7 s, servidor Next de desenvolvimento. |
| Rotas | Home, ambientes, profissionais, lojas, orçamento e nove fichas responderam 200. Ficha inexistente respondeu 404. Redirect legado Savoy verificado. |
| Browser/console | Nenhum `pageerror` nas rotas percorridas; nenhum `console.error` antes da visita intencional à página 404. |
| Catálogo | Busca por ref, filtro de parede, URL após reload, ordenação A–Z, vazio e limitação a três comparados passaram. |
| Teclado | Zoom aberto por Enter, Escape fecha e retorna foco. Comparação também retorna foco. |
| Seleção | Área, nota e unidade manipuladas; área e nota persistem após reload; resumo e remoção testados. Clipboard com tratamento de falha. |
| Estado de erro | Escrita do localStorage bloqueada por teste: aviso visível e resumo ainda disponível em memória. |
| SEO | Canonical de Classic, sitemap e robots bloqueado por padrão verificados. |
| Mobile | Viewport 390 × 844, ausência de overflow horizontal nas rotas testadas, menu funcional e preferência reduced-motion emulada. |
| Capturas | `test-results/home-desktop.png` e `test-results/catalog-mobile.png` geradas e inspecionadas. Imagens lazy abaixo da dobra podem não estar carregadas na captura integral; carregamento foi verificado separadamente ao rolar. |
| Build final | **Bloqueado**: módulo `@/components/simulator/Simulator` não encontrado. |
| Typecheck final | **Bloqueado pelo mesmo módulo ausente**. Nenhum outro erro reportado. |

## Histórico: ajustes durante validação inicial

| Antes | Depois | Motivo |
|---|---|---|
| Loading global permitia streaming com HTTP 200 para slug inexistente | Loading do simulador isolado; slugs restritos por `dynamicParams=false` | Teste confirmou HTTP 404 real. |
| Labels envolvendo textarea incluíam conteúdo no nome acessível | `htmlFor` e IDs explícitos | Nome estável para leitor de tela e testes. |
| Dialog mantinha imagem grande oculta no DOM | Imagem ampliada renderizada somente quando aberto | Evita download oculto; preserva dialog nativo e retorno de foco. |
| Escape fechava menu sem reposicionar foco | Foco retorna ao botão Menu | Evita foco em link oculto. |
| Busca seguinte do teste disparava antes da navegação de limpar terminar | Teste aguarda a contagem de nove produtos | Elimina corrida do teste sem mascarar resultado da busca. |

## Histórico: revisão visual inicial

Modo tasteful-ui: production_ui_implementation, pois direção e autonomia vieram aprovadas. A composição mantém título em destaque, fotografia arquitetônica dominante e assimetria nos materiais relacionados. Catálogo privilegia comparação legível e ações textuais. Sem interface anterior para alegar melhoria comparativa. Revisão heurística, não pesquisa com usuários nem certificação de acessibilidade.

## Histórico: bloqueios e limites pré-integração (superados quanto ao módulo)

O simulador não foi criado nem substituído por mock: a pasta pertence a outro responsável. `/simulador`, WebGL, descarte de recursos, carregamento e fallback 3D não foram testados. Build e typecheck completos devem ser repetidos após a integração real. A entrega não está liberada para produção.

Não executados: Firefox/Safari, dispositivos físicos, Lighthouse, axe, testes de servidor de produção, integração comercial, autorização de imagens ou confirmação de contatos por telefone. Não houve deploy, mensagem enviada, compra ou alteração de permissões do agente.
