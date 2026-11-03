# Kazamais · matéria antes da forma

Direção aprovada: editorial arquitetônica. Modo tasteful-ui: production_ui_implementation. Público: pessoas reformando e profissionais especificadores. Objetivo: explorar nove referências auditadas, entender limites técnicos, selecionar e preparar uma conversa com uma unidade.

## Composição
Hero com título à esquerda e fotografia arquitetônica larga abaixo; legenda deslocada. O ritmo alterna grandes imagens e texto curto, sem carrossel automático, métricas ou depoimentos inventados. Catálogo usa grade regular por necessidade de comparação; páginas editoriais usam assimetria. Mobile preserva a ordem de leitura, controles explícitos e alvos de 44 px.

O hero oferece exploração do catálogo como ação principal e “Visualizar em um ambiente” como ação secundária, vinculada ao material apresentado. A home alterna a grade de destaques com um índice tipográfico numerado de aparências, um processo de seleção/comparação/especificação para profissionais e uma lista das quatro unidades reais. A numeração de aparências serve à consulta do índice, não indica ranking; os passos profissionais têm sequência. Cimento e concreto mantêm links separados porque são valores distintos dos filtros. Relevo usa o valor documentado “Monocolor, relevo 3D”. Sem novas grades de cards para esses blocos.

## Sistema
Tokens no CSS são a fonte executável: papel #f6f4ee, areia #e7e1d5, grafite #292d2b, mineral #405c53, secundário #62665f. Georgia para títulos editoriais e Trebuchet MS/sans-serif humanista para leitura e controles: sem download de fontes ou licenças supostas. Cantos discretos de 2 px, fotografia sem moldura e sem sombras decorativas. Logo oficial preservado, sem recolorir. A marca existente e os materiais reais prevalecem sobre referências de SaaS; catálogo tasteful consultado como orientação, não como identidade emprestada.

## Comportamento
Filtros derivados exclusivamente dos campos confirmados. Valores ausentes não são inferidos de fotos ou nomes. Comparação até três itens, separada da seleção de orçamento. Seleção persistida no dispositivo, área e notas opcionais. Sem preços, estoque, caixas ou envio fictício. Dialog nativo para zoom com Escape e retorno de foco. Movimento de feedback de 120–180 ms, sem parallax ou stagger; reduced-motion remove transformações.

## Limites e correção vinculante
Os nove materiais devem ser aplicáveis diretamente ao piso ou à parede da sala. Sem expositor, sem filtro técnico impedindo estudo visual. `surfaces` preserva indicações técnicas, com aviso contextual quando o uso não está verificado; Classic no piso não recebe indicação técnica. Materiais e orientação independentes. Faces locais identificadas nunca são substituídas por fotos ambientadas. Juntas vêm do campo publicado quando existente; luz, rugosidade e relevo são aproximados, não PBR medido.

Tabelas de dados publicados pela Kazamais permanecem completas, com conflitos separados dos campos conciliados. Não recalcular embalagem inconsistente. Foco teclado mineral de 2 px interno evita corte; bordas estáveis e hover mineral, sem sombra preta. Reduced-motion preservado. Imagens não certificam adequação técnica nem licença independente de terceiros. Seleção local, sem envio de pedidos. Nenhuma permissão visual substitui autorização de servidor.

## Refinamento das superfícies
Madero tem fibra, marcas de serra e variação entre 16 faces oficiais, em vez de faixas procedurais. Monterrey usa manchas reais de três faces únicas. Savoy usa oito faces oficiais claras com veios finos, substituindo o desenho procedural escuro/repetitivo. Atlases mantêm escala física, repetição e orientação independentes. Sem fotos ambientadas no mapa. Imagens de 510–600 px no maior eixo conservam limite de detalhe; nenhum upscaling é vendido como alta resolução.

Bump e rugosidade são mapas artísticos discretos derivados da luminância, não PBR medido ou geometria de relevo. A iluminação balanceia preenchimento neutro e luz de janela; sombra direcional com frustum ajustado e contato 256² capturado uma vez, sem pós-processamento. Evidência antes/depois com câmera fixa em `docs/evidence/compare-*.png`.

Todos os tipos de controle tiveram revisão de regras globais/escopadas. Thumbnails selecionadas usam mineral (não grafite); inputs/selects conservam borda estável. `InteractionModality` acompanha pointerdown/keydown sem consumir eventos ou remover foco: mouse sem outline; teclado com foco-visible, inclusive dialogs e menu. Contraste de foco claro reservado às superfícies escuras.
