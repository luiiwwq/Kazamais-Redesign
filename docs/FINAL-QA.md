# QA final integrado — revisão inicial e revalidação

## Estado atual — revalidação de 2026-11-03

**F1–F5 encerrados no escopo revalidado.** As correções foram confirmadas por leitura dos arquivos atuais e execução seletiva dos testes existentes. A reprovação/pendências descritas no registro inicial abaixo são históricas, não o estado atual. Aceite das correções funcionais, sem equivaler a autorização de publicação ou certificação integral.

### Status por achado

| Achado inicial | Status atual | Evidência da revalidação |
|---|---|---|
| F1 — Comparação omitia Piso (média) | Corrigido e revalidado | catalog.tsx:75–77 traduz todas as superfícies. Teste site.spec.ts:37–58 passou: Madero e Monterrey = Piso, Parede; Classic = Parede; Artsy = A confirmar. |
| F2 — Filtro Piso ausente (média) | Corrigido e revalidado | catalog.tsx:10–11,49–52 deriva opções dos dados. Mesmo teste confirmou dois pisos, nomes dos produtos, URL aplicacao=floor e preservação após reload. |
| F3 — Edição atrasada recriava removido (média) | Corrigido no cenário reproduzido; limites abaixo | selection.tsx:44–66 sincroniza storage/foco; 69–98 relê/grava sob Web Lock; 110–115 aplica patch sem recriar removidos. Três testes multiaba passaram: propagação, edição atrasada com notificações bloqueadas, concorrência determinística de área/nota e reload. |
| F4 — Documentação pré-integração apresentada como atual (baixa) | Corrigido por inspeção documental | README:22,33,38,53,77–83 descreve integração, superfícies, política multiaba e validações. IMPLEMENTATION-QA:5–34 registra estado integrado; 36–76 identifica explicitamente histórico pré-integração. |
| F5 — Expectativa antiga de uma parede (baixa) | Corrigido e revalidado | site.spec.ts:21 exige três paredes também após reload; teste completo de busca/filtros/ordenação/vazio/limite de comparação passou. |

### Verificações executadas pelo revisor nesta rodada

Relidos integralmente src/components/catalog.tsx, src/components/selection.tsx, tests/site.spec.ts, docs/IMPLEMENTATION-QA.md, README.md e o relatório inicial.

Comando executado, sem modificar testes:

```powershell
npm run test:e2e -- --grep "busca, filtros|piso confirmado|seleção sincroniza|edição de aba|mutações concorrentes" --output "C:\Users\LMlim\AppData\Local\Temp\opencode\kazamais-final-revalidation"
```

**Resultado observado: 5/5 aprovados, 15,4 s**, Chromium, um worker, configuração Playwright existente com servidor de desenvolvimento. Evidência primária: saída bruta do comando nesta sessão. Diretório de saída separado para não sobrescrever artefatos anteriores; não foram produzidos novos screenshots nesta rodada.

### Resultados reportados pelo implementador, não repetidos pelo revisor nesta rodada

Conforme docs/IMPLEMENTATION-QA.md:17–26: suíte completa 9/9 em 32,9 s; typecheck e build aprovados; smoke do simulador aprovado nos três tamanhos, incluindo fallback/perda de contexto, errors=[]. Esses resultados foram lidos como registro do implementador. Esta revalidação independente executou somente os cinco testes acima; não reexecutou os outros quatro, build, typecheck ou smoke.

### Limites atuais e riscos residuais

- Cobertura multiaba confirmada em Chromium com Web Locks. Sem essa API, há rebase síncrono, mas não atomicidade entre abas; o fallback não foi exercitado. Não generalizar aprovação para concorrência em todos os navegadores.
- Campos diferentes preservados sob lock; política documentada para o mesmo campo é última gravação na ordem do lock. Conflitos no mesmo campo, rejeição de lock, remoções concorrentes e seleção explícita após remoção não receberam testes adicionais nesta rodada.
- Unidade de preferência não participa da sincronização multiaba dos itens. Isso está explicitado na documentação atual.
- O teste de armazenamento indisponível integra os 9/9 reportados, mas não foi reexecutado neste recorte. A manutenção do modo de sessão foi inspecionada no código, não revalidada aqui por novo teste.
- Sem nova revisão visual completa, screenshots, auditoria de acessibilidade, Safari/Firefox, dispositivo físico, benchmark GPU/memória ou instrumentação de visibilidade/DPR. A revisão visual e de teclado inicial permanece evidência histórica, não nova validação das correções.
- Nenhuma auditoria integral de segurança, dependências ou conformidade; permanecem gates comerciais de direitos de imagem, domínio/indexação e validação técnica antes de publicação. Sem deploy.
- Sem baseline Git para atribuição temporal. Referências de linhas e caminhos de artefatos no histórico correspondem à revisão inicial; artefatos em test-results podem ter sido substituídos por execuções posteriores e sua permanência não foi verificada nesta rodada.

**Escrita desta revalidação:** somente docs/FINAL-QA.md e saída de testes no diretório temporário autorizado. Nenhum código-fonte, teste, dependência ou outro documento alterado pelo revisor. Nenhum subagente utilizado.

---

O registro abaixo preserva reprodução, achados e verificações da revisão inicial. Todas as afirmações de falha/pendência F1–F5 abaixo devem ser lidas com os status atualizados acima.

## Registro histórico — revisão inicial de 2026-11-03

### Resultado inicial (superado pela revalidação acima)

**Aprovacao com pendencias; nao liberar como entrega sem ressalvas.** Nenhum codigo-fonte, dependencia ou teste existente foi alterado. Existem duas inconsistencias funcionais de catalogo decorrentes da ampliacao dos dados, uma falha de persistencia entre abas e documentacao de integracao desatualizada. Nao foi encontrado bloqueador no smoke do simulador.

## Achados reproduziveis

### F1 — Media: comparacao omite aplicacao Piso
- Reproducao: /revestimentos?ordem=az; comparar Artsy, Classic e Madero; abrir comparacao.
- Esperado: Madero mostra Piso e Parede, como sua ficha e simulador.
- Observado: linha Aplicacao = A confirmar | Parede | Parede. Madero perde Piso. O mesmo tratamento afeta Monterrey.
- Evidencia: DOM real Chromium de producao; src/components/catalog.tsx:13, confrontado com src/data/index.ts:67,73 e ficha [slug]/page.tsx:11.
- Correcao sugerida: traduzir cada entrada de surfaces e concatenar; nao converter apenas a existencia de superficies em Parede. Adicionar cobertura comparativa de produto com duas superficies em tarefa separada.
- Classificacao: incompatibilidade de integracao exposta pelos dados novos; sem historico Git para atribuir autoria ou commit.

### F2 — Media: filtro de aplicacao nao oferece Piso
- Reproducao: abrir catalogo e seletor Aplicacao confirmada.
- Esperado: poder filtrar os dois pisos confirmados.
- Observado: unicas opcoes sao Todas / a confirmar e Parede; simulador oferece os dois pisos.
- Evidencia: opcoes lidas no navegador e catalog.tsx:13; base confirma 2 floor / 3 wall.
- Correcao sugerida: gerar opcoes das superficies documentadas ou adicionar Piso e testar URL/reload.
- Classificacao: lacuna de integracao apos ampliacao da base, nao falha da selecao de materiais no simulador.

### F3 — Media: aba desatualizada ressuscita item removido do orcamento
- Reproducao: selecionar Savoy; abrir /orcamento em duas abas do mesmo contexto; remover Savoy na aba A; editar nota de Savoy ainda visivel na aba B; recarregar A.
- Esperado: remocao preservada ou conflito explicitamente resolvido, sem sobrescrita silenciosa.
- Observado: Savoy reaparece. Saida executada: MULTITAB resurrected Savoy 1.
- Evidencia: Chromium, mesmo BrowserContext; selection.tsx:10-13 carrega apenas ao montar e grava a lista completa sem listener storage/resolucao de conflitos.
- Correcao sugerida: sincronizar eventos storage e definir politica para conflitos; testar remocao/edicao concorrente.
- Classificacao: defeito no provider existente, nao causado pelo simulador; origem temporal nao comprovavel sem baseline. Persistencia de uma unica aba passou.

### F4 — Baixa: documentacao geral ainda descreve simulador inexistente
- Reproducao: ler README.md:17,28,71 e docs/IMPLEMENTATION-QA.md:22-23,41.
- Esperado: distinguir registros historicos do estado integrado atual.
- Observado: README diz que Simulator.tsx precisa ser entregue e rota e reservada; relatorio anterior registra modulo ausente/build bloqueado. Arquivo existe; producao e smoke funcionam; docs/SIMULATOR.md registra build/typecheck aprovados.
- Correcao sugerida: atualizar README e marcar QA anterior como pre-integracao, preservando o historico. Este relatorio nao modifica aqueles documentos.

### F5 — Baixa: expectativa antiga interrompe cobertura do catalogo
- npm run test:e2e: 4 passaram, 1 falhou (30,2 s).
- tests/site.spec.ts:21 espera 1 revestimento para parede; observado corretamente 3 revestimentos encontrados.
- Nao e regressao funcional da contagem. Atualizar expectativa em tarefa de escrita separada; atualmente esse teste nao chega a verificar vazio/ordenacao/comparacao. Esses caminhos foram exercitados adicionalmente nesta revisao.

## Verificacoes efetivamente executadas

- Leitura das duas skills solicitadas e de seus SKILL.md originais. Revisao heuristica local; nenhuma API chamada, nenhum enriquecimento remoto, nenhuma metrica comercial ou codigo de principio inventado.
- npm run test:e2e: 4/5; rotas/imagens/404/redirect, metadata/robots/sitemap, storage indisponivel, selecao/zoom, mobile/menu/reduced-motion passaram. Falha exclusivamente na expectativa antiga de parede.
- node --experimental-strip-types src/components/simulator/smoke.cjs: PASS em 1440x1000, 820x1180, 390x844. PASS materiais, orientacoes independentes, cameras, luz, reset, orcamento preservado, ausencia de reload/remount, perda real de contexto pela extensao e retry, fallback GL indisponivel; errors=[]. Aviso Node MODULE_TYPELESS_PACKAGE_JSON nao fatal.
- Navegacao adicional Chromium contra build de producao existente, servidor temporario porta 3218: todas as **16 rotas** responderam 200, um h1 por rota, imagens visiveis carregadas apos rolagem e sem overflow horizontal nas tres larguras. Sete rotas gerais em alturas 1000/1180/844; nove fichas em altura 1000 nas tres larguras.
- Rotas: /, /revestimentos, /ambientes, /profissionais, /lojas, /orcamento, /simulador, e nove slugs exportados em src/data/index.ts.
- Comparacao: limite de 3, quarta checkbox desabilitada, dialog abre, Escape fecha e restaura foco. Vazio e ordenacao A-Z passaram.
- Orcamento: area 25.5, nota e unidade Paulinia persistiram apos reload e aparecem no resumo; fluxo multiaba falhou conforme F3.
- Nao repetidos typecheck/build: docs/SIMULATOR.md registra aprovacao recente; smoke e navegacao usaram o build existente. Isso nao prova reprodutibilidade de build limpo nem igualdade criptografica entre fontes e build.

## Midia e acessibilidade

Geradas nove capturas test-results/final-{desktop,tablet,mobile}-{home,revestimentos,simulador}.png. Inspecionadas visualmente home desktop, catalogo mobile e simulador nos tres tamanhos. Fotos carregadas, hierarquia e controles sem sobreposicao impeditiva nessas imagens. Cena e claramente conceitual e acompanhada de limitacoes; nao foi declarada fidelidade ao fabricante. Screenshots da cena mostram base cenografica; variacoes de materiais foram verificadas por diferenca de pixels no smoke, nao por certificacao visual de textura.

Teclado: zoom/retorno de foco, dialog comparativo, rotacao por Home/End e menu cobertos. Rotulos HTML e estados de fallback presentes. Nenhum defeito adicional de acessibilidade foi confirmado nesta cobertura; isso NAO equivale a conformidade WCAG. Nao executados leitor de tela, axe, Lighthouse, zoom 400%, auditoria completa de contraste ou todos os estados de foco.

Heuristicas: consistencia e correspondencia com o modelo mental falham em F1/F2; feedback e prevencao de perda falham no conflito F3. Contagens de opcoes ou gosto estetico nao foram classificados como bugs. Pontos positivos: dados desconhecidos explicitados, vazio recuperavel, acao de copiar com fallback e limites claros da simulacao.

## Evidencias e limites

- test-results/site-busca-filtros-URL-ordenação-vazio-e-comparação-limitada-chromium/error-context.md e trace.zip: falha da expectativa antiga.
- test-results/home-desktop.png e catalog-mobile.png: suite existente.
- test-results/final-*.png: capturas desta revisao.
- Saidas brutas dos comandos na sessao: smoke, 48 navegacoes de rotas, comparacao e persistencia. Os probes adicionais foram executados em memoria, sem criar arquivos de testes nem alterar fontes.
- Tentativas iniciais de probes falharam por quoting/sintaxe e por servidor 3000 ja encerrado; nao contadas como verificacoes aprovadas. Probes corrigidos foram executados em servidor temporario proprio, encerrado no finally.
- Sem repositorio Git/baseline: nao e possivel provar cronologia de todos os defeitos. F1/F2 sao inconsistencias observaveis entre consumidores atuais e dados ampliados; F3 pertence ao provider compartilhado.
- Nao houve auditoria completa de autorizacao/dependencias, teste de exfiltracao, chamada comercial, deploy ou validacao de licencas. Nao ha fluxo autenticado no escopo inspecionado. Direitos de imagem e configuracao de dominio/indexacao continuam gates de publicacao documentados.
- Sem Safari/Firefox/dispositivo fisico, benchmark GPU, memoria/termica, instrumentacao de pausa por visibilidade/DPR. Auditoria automatizada nao garante seguranca nem conformidade integral.

Arquivos escritos: apenas este relatorio e evidencias em test-results/. Codigo-fonte preservado. Correcoes dependem de tarefa separada e nova validacao integrada.

