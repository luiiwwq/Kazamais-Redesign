# Auditoria de dados Kazamais

Consulta: 2026-11-03. Escopo exclusivo: `src/data/**` e este documento.

## Método e contrato

Lidos README e catálogo de imagens em `src/assets`; busca `**/AGENTS.md` não encontrou instruções locais adicionais. Preservados todos os assets. Não havia schema de dados no diretório inicial inspecionado. Criado `src/data/index.ts`, exportando `Product`, `Store`, `products` e `stores`. Nenhuma API, dependência, configuração ou persistência foi alterada nesta delegação de dados editoriais.

`Product` mantém exatamente os campos solicitados. Dimensões em cm, sem terceira coordenada de embalagem/espessura. Campos opcionais conflitantes são omitidos. `color` é texto, não CSS; string vazia significa cor não verificada, sem dedução pelo nome comercial ou por amostragem da imagem. `surfaces: []` significa desconhecido, não incompatibilidade. Códigos isolados, coeficiente de atrito, Junta Piso ou fotografia não comprovam aplicação. Indicação oficial vinculada à ficha e acompanhada de legenda explícita pode confirmá-la. Após aprofundamento, Madero e Monterrey têm `['floor', 'wall']`; Classic mantém `['wall']`. Não usar a orientação genérica de argamassa da ViaRosa como autorização para piso do Deco.

`source` aponta para a ficha original; fontes adicionais e conflitos ficam em `notes`. Os dados não garantem disponibilidade, preço, estoque, atualização de telefone nem adequação a um projeto. Valores R$0.00 e comandos Comprar das páginas não foram importados como oferta real.

## Cobertura: 10/10 páginas lidas com sucesso

| Fonte original | Evidência e decisão |
|---|---|
| https://kazamais.com.br/blog/ | Nove produtos, quatro lojas, fabricantes, formatos. Botão Classic usa `/product/` em vez de `/produto/`; não adotado. Imagem Blackwood associada a Santa Diamond; excluída. |
| https://kazamais.com.br/blog/produto/monte-saint-michez-fendi/ | REF 73003, acetinado, cimento; 123 × 123 também na home. Terceiro valor 3 cm não representa espessura técnica 10,50 mm. |
| https://kazamais.com.br/blog/produto/artsy-cement/ | REF 24614E, 90 × 90. Acetinado no texto/categoria versus POL no arquivo da referência; galeria contém NAT 24613 e POL 24614. Acabamento omitido, imagens selecionadas 24614. Pesos líquido/bruto inconsistentes, não importados. |
| https://kazamais.com.br/blog/produto/ladrilho-ceramico-villagres-santa-diamond-natural/ | CV252550, formato 25 × 25, natural. Villagres na home/slug versus Ceramicasa na ficha: marca omitida. Arquivo de face contém PV321, identidade permanece dependente da associação editorial da ficha. |
| https://kazamais.com.br/blog/produto/minimalismo-bruto-gr/ | 62233, Portinari, natural, 100 × 100 confirmado também na home. Embalagem 1 m²/2 peças conflita com área geométrica; não incorporada. |
| https://kazamais.com.br/blog/produto/madero-jatoba-externo/ | 2481A, Villagres. Home 24,5 × 100 versus ficha 25 × 100: aprofundamento oficial confirmou formato comercial 24,5 × 100 e acabamento Externo. |
| https://kazamais.com.br/blog/produto/monterrey-cement/ | 108009, Villagres, natural, cimento, 108 × 108, concordante com home. |
| https://kazamais.com.br/blog/produto/savoy/ | 820011, Villagres, 82 × 141,5. Acetinado na home/tabela versus descrição mármore prata polido: acabamento omitido. Arquivos nomeiam Savoy Silver; título original preservado. Prata/veios brancos explicitados no texto. |
| https://kazamais.com.br/blog/produto/thor-sand/ | 12750E, Portobello, 80 × 80. Acetinado no texto versus EXT no arquivo: acabamento omitido. Ambientes de 60 × 60 e 30 × 60 excluídos. |
| https://kazamais.com.br/blog/produto/classic-white-deco/ | AR72056; ficha 75 × 75 versus home 72 × 72. Validação oficial resolve em 72 × 72; foto principal AR72000 rejeitada por referência diferente. |

Dimensões não conflitantes foram verificadas nas publicações Kazamais, não certificadas por fabricante. Não afirmar que todos os nove produtos têm validação independente. Não corrigir grafia comercial Michez nem códigos por suposição.

## Investigação em fabricantes

**Confirmado:** https://viarosa.com.br/produtos/classic-white-deco/ (alcançada pela rota singular `/produto/classic-white-deco/`). Página identifica AR72056, formato 72 × 72, textura acetinado, relevo 3D, aplicação Parede, LF paredes internas/externas/fachadas, espessura 11 mm. Resolve dimensão e aplicação; espessura difere dos 10 mm da Kazamais e fica fora do contrato. Fotos oficiais substituem a face AR72000. Página também oferece PDF técnico, não baixado nesta auditoria: https://viarosa.com.br/wp-content/uploads/2025/07/AR72056-CLASSIC-WHITE-DECO.pdf.

**Tentativas sem evidência de produto:**

- `https://www.villagres.com.br/produtos/madero-jatoba`, `/produtos/savoy-silver`, `/produto/madero-jatoba`, `/produto/savoy-silver`: HTTP 404. São rotas tentativas, não fichas oficiais descobertas nem prova de descontinuação.
- `https://www.portobello.com.br/produtos/artsy/artsy-cement/90x90/polido/24614` e `/produtos/artsy/artsy-cement`: HTTP 404; não validam acabamento.
- `https://www.ceramicasa.com.br`: erro de transporte; não resolve marca de Santa Diamond.
- `https://www.viarosa.com.br`: acessível, encaminha conteúdo em inglês; ficha específica em português acessível.

Pendências após aprofundamento: obter fichas oficiais históricas pelos códigos 24614E, CV252550, 820011, 73003, 62233 e 12750E. Madero e Monterrey agora possuem validação oficial descrita abaixo. Falhas de rotas não constituem busca exaustiva dos catálogos.

## Lojas

Quatro unidades publicadas no rodapé das dez páginas, exportadas com endereço e horário. Mantida apenas a linha fixa não conflitante de Itapira: `(19) 3813.1904`. Segundo número excluído: texto `(19) 7813.5874` mas href `tel:19978135874` (dígito 9 adicional). Não corrigido por inferência. WhatsApp central da home `5519991926009` não atribuído a uma unidade. Horários são publicados, não confirmados por contato; não foram realizadas chamadas nem enviados formulários.

## Imagens e direitos

URLs reais extraídas das galerias das fichas, sem placeholders ou imagens geradas. `kind` distingue face e ambiente conforme identificação editorial dos arquivos; não constitui ensaio técnico ou comprovação de aplicação. Imagens com identidade conflitante foram excluídas; o ambiente oficial Classic inclui também AR72080, explicitado no alt. **Atualização: o usuário autorizou expressamente o uso das informações e assets Kazamais neste projeto.** Substitui a pendência anterior de autorização Kazamais. Não comprova nem concede licença independente de fabricantes/fotógrafos. Acesso público não é licença. Nenhum asset existente foi alterado nesta auditoria original; URLs foram verificadas como links presentes nas páginas consultadas.

## Verificações e limites

- Leitura remota efetiva das dez páginas e da ficha oficial ViaRosa; falhas de fabricantes discriminadas acima.
- Revisão do contrato: nove slugs únicos, quatro lojas, opcionais preservados, sem preços/estoques fictícios, sem superfícies inferidas.
- Executado com TypeScript 5.5.4: `tsc --noEmit --strict --target ES2020 --module ESNext src/data/index.ts`, aprovado sem emissão de arquivos.
- Na primeira entrega, executadas assertions com Node v24.21.0 para contrato básico e estado conservador inicial: PASS. As expectativas antigas de superfície exclusivamente Classic e ausência de dimensões em Madero foram substituídas após a pesquisa abaixo. Isso não testa disponibilidade HTTP dos binários nem certifica especificações de fabricante.
- Recuperação: remover somente os arquivos novos desta delegação caso necessário; não há migração nem alteração destrutiva de dados.

## Aprofundamento oficial — 2026-11-03

### Descoberta reproduzível, sem adivinhar fichas

1. Villagres: `https://www.villagres.com.br/robots.txt` acessível, sem sitemap declarado; `/sitemap.xml` retornou 404. Home levou a `/PT/produtos` e `/PT/produto/f` (Acervo). HTML do formulário revelou GET `/PT/busca`, parâmetro `search`.
2. Consultadas `https://www.villagres.com.br/PT/busca?search=Monterrey` e `https://www.villagres.com.br/PT/busca?search=Madero`: retornaram links específicos 108009a e 2481a. Não confundidos com Monterrey 108053 (Externo) nem Madero 200017 (outro formato).
3. Webfetch sem sessão entregava texto inglês e campos técnicos vazios, inclusive em `/pt/` e `/pt-BR/`. Resolvido com sessão HTTP mantida em memória: GET `https://www.villagres.com.br/language/pt-BR`, depois GET da ficha com a mesma WebRequestSession. Isso tornou formato, superfície e indicação legíveis. Nenhum login, alteração de conta ou persistência de cookies em arquivo.

### Confirmações vinculadas à referência

**Monterrey Cement 108009** — https://www.villagres.com.br/PT/produtos/metropolitana/monterrey/108009a

- Formato `108x108cm`; fabricação `1080x1080mm`; superfície `Natural`.
- Na própria especificação: **Local 3**, ambientes internos residenciais/comerciais com alto tráfego, garagens, escadas, saídas de emergência e áreas externas descobertas, **exceto em torno de piscinas**, incluindo locais 1 e 2.
- Na legenda de indicação do próprio documento: **Local 1 — Uso para paredes e interior de piscina**; Local 2 — ambientes internos residenciais e comerciais de baixo tráfego, mais Local 1.
- Piso confirmado pela indicação explícita de tráfego/garagens/escadas; parede pela inclusão expressa do Local 1. Exportado `['floor','wall']`. Não generalizar para todo piso externo ou entorno de piscina.

**Madero Jatobá 2481A** — https://www.villagres.com.br/PT/produtos/naturale/madero/2481a

- Busca e rota identificam `2481A`; ficha exibe referência comercial `2481`.
- Formato comercial **24,5x100cm**, superfície **Externo**; fabricação **245x995mm**. Contrato usa formato comercial, não medida de fabricação. Corrige 25 × 100 da ficha Kazamais, preservando o conflito em notes.
- Indicação **Local 4 — Ambientes externos descobertos, áreas molhadas e entorno de piscinas. Rampas para pedestres com inclinação de até 10°. + local 1**.
- Mesma legenda oficial Local 1 inclui paredes e interior de piscina. Exportado `['floor','wall']`. Acabamento Externo confirmado independentemente da categoria Acetinado da revenda.
- Coeficiente atual publicado ≥0,5 versus ≥0,6 da Kazamais; não exportado pelo contrato, não usar a antiga alegação como certificação de lote.

### Bloqueios e resultados não transferíveis

**Savoy 820011:** busca `search=Savoy` não retornou ficha (conteúdo da home); busca `https://www.villagres.com.br/PT/busca?search=820011`, em português, retornou “Busca não encontrou dados com esses filtros”. Acervo `https://www.villagres.com.br/PT/produto/f?nameOrCod=820011` aceitou `nameOrCod=820011` no estado público Livewire, mas `prods` permaneceu null. Chamada de leitura `search()` pelo endpoint Livewire `/livewire/message/home.discont.search-prod` resultou HTTP 405. Não é prova de inexistência/descontinuação. Acabamento e superfícies seguem não confirmados.

**Minimalismo 62233:** `https://www.ceramicaportinari.com.br/`, `/robots.txt` e `/sitemap.xml` retornaram HTTP 403; domínio alternativo `https://www.portinari.com.br/` apresentou erro de transporte. Não houve contorno de controle de acesso. Sem legenda oficial vinculada à referência: superfícies continuam vazias, dados existentes não promovidos a validação oficial.

**Monte 73003:** domínio Castelli correto confirmado pelo link no rodapé de `https://www.embramaco.com.br/porcelanato`. `https://castelliporcelanato.com.br/robots.txt` declara `/sitemap.xml`, lido com sucesso, que lista `/produtos`. Host com www apresentou aplicação de agendamentos, não usado como ficha.

HTML de `https://castelliporcelanato.com.br/produtos` revelou `Product.list`, filtros do catálogo e script público `https://castelliporcelanato.com.br/public/assets/request/request.min.js`. Executada apenas consulta pública **POST https://castelliporcelanato.com.br/transaction/Product/list**, JSON plano:

```json
{"ord":"recent","attributes":[],"ambientes":[],"packages":[],"title":"Monte","favorites":false,"site":"castelli","status":1}
```

Sessão/token público do próprio catálogo usados em memória, sem credenciais administrativas; nenhum método de gravação chamado. Resposta status 200 com três produtos. Registro **id 391**, slug `monte-saint-michez-fendi-391`, nome Monte Saint Michez Fendi, **código CA120003**, package **122x122cm**, atributos Tipologia **Acetinado** e Piso ou Parede **Parede/Piso** explícitos. Outros dois registros são variantes Plus de 83 × 83. **Não há equivalência comprovada entre CA120003 e 73003/123 × 123**, portanto não foram transferidos superfície nem formato. Mantido o registro histórico Kazamais; requer ficha antiga ou declaração do fabricante para liberar esse item.

### Impacto no simulador e limitações

- Base agora oferece **dois produtos de piso e três de parede**, sem criar permissões para atingir uma quantidade artificial.
- `surfaces` permite seleção por superfície, mas não modela todos os ambientes, tráfego, inclinação ou instalação; restrições permanecem em notes. Simulação visual não é especificação técnica.
- Somente os dois arquivos autorizados foram alterados. Não foi alterada nem testada a interface de alternância. Madero/Monterrey ainda possuem imagens `room`; se o renderizador exigir textura `tile`, a compatibilidade de dados sozinha não resolve essa dependência. Não reclassificar foto de ambiente como face.
- Registro histórico: não foram baixados binários nem alteradas imagens naquela rodada. A autorização Kazamais foi posteriormente relatada pelo usuário, conforme seção de direitos acima; licenças independentes de terceiros não foram inventadas.

### Verificações executadas nesta rodada

- Comando antigo de TypeScript sem resolução explícita falhou ao resolver dependências de tipos agora presentes (`undici-types`, `csstype`). Sem alterar configurações/dependências, executado `tsc --noEmit --strict --target ES2020 --module ESNext --moduleResolution bundler src/data/index.ts`: **PASS**.
- Assertions Node com importação real do módulo: nove produtos/slugs únicos, quatro lojas, superfícies e fontes oficiais nos dois Villagres, Madero 24,5 × 100/Externo, Monterrey Natural, Classic somente parede, Savoy/Minimalismo/Monte ainda sem aplicação confirmada, Savoy sem finish: **PASS; 2 floor / 3 wall**.
- Node emitiu aviso `MODULE_TYPELESS_PACKAGE_JSON`, mas concluiu os testes; manifest preservado por estar fora do escopo. Nenhum teste de navegador ou do simulador foi executado.
