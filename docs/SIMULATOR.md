# Simulador — estado atual, 2026-11-03

## Superfícies reais
Sem expositor, pedestal ou ocultação do mobiliário. O seletor Material contém nove produtos para piso e parede. Escolher altera diretamente a malha de piso (4,80 × 4,20 m) ou parede posterior (4,80 × 2,80 m), sem navegação nem remontagem do Canvas. Materiais e orientação são independentes. Laterais e mobiliário são cenográficos.

`surfaces` continua sendo indicação técnica, não restrição do estudo visual. Classic White Deco em piso mostra aviso de indicação somente para parede; demais usos não verificados mostram aviso contextual. Nenhuma indicação foi inventada.

Deep links usam a primeira superfície técnica quando existe, senão parede. Slug desconhecido gera aviso. Reset limpa os dois materiais, orientações, câmera, rotação e luz, sem apagar orçamento. URL não é alterada pelo reset.

## Texturas e escala
Seis faces locais: Monte, Artsy, Santa Diamond, Minimalismo, Thor e Classic. Somente imagens classificadas `tile`, nunca `room`. Canvas limitado à resolução original e a 2048²; Santa Diamond continua limitado a 450². Não são albedo/PBR medidos e podem conter iluminação fotografada.

Madero, Monterrey e Savoy agora usam **faces oficiais locais** extraídas dos ZIPs do fabricante: 16 de 147×600 para Madero, 3 únicas de 510×510 para Monterrey (a quarta é duplicada byte a byte), 8 de 343×600 para Savoy. Os ZIPs não oferecem resolução maior que essas imagens. Contact sheets inspecionadas, manifest com hashes em `docs/evidence/official-faces.json`. Não são fotos de ambiente, não são apresentadas como alta resolução.

Atlas distribui faces em ordem determinística não sequencial, mantendo tamanho de peça e junta. Máximo 2048 por eixo; não amplia resolução da face. Rotação troca eixos do atlas e gira cada peça, sem alterar a escala. Color maps sRGB, mapas de dados NoColorSpace. Bump/roughness artísticos de até 512 por eixo derivados da luminância, com amplitude restrita: não são relevo ou PBR medidos. Todos os mapas próprios são descartados na troca/desmontagem.

Fallback procedural aprimorado: fibra/marcas de serra e nós discretos na madeira, cimento com três escalas de manchas/poros, mármore com caminhos irregulares e variação por peça. É provisório durante carregamento e explicitamente identificado em caso de falha. Nenhuma face faltante produz falso sucesso: o atlas oficial só é apresentado após todas carregarem.

Junta lida de `technicalDetails`: 2 mm Monte/Madero/Monterrey/Savoy/Classic, 1,5 mm Artsy/Thor, 3 mm Diamond, seca Minimalismo. Texto publicado não é recomendação de assentamento. Ausência usa 3 mm ilustrativos. UVs usam formato em metros mais junta; rotação troca eixos e gira desenho. Sem calculadora, perdas ou geometria medida de relevo.

Ambiente local 64² capturado uma vez; preenchimento hemisférico reduzido e neutro, painel luminoso orientado à janela e luz direcional recalibrada. Sombra 1024² com frustum mais justo, bias menor e filtragem PCF existente; antialias do renderer preservado. ContactShadows 256², blur 2,4, opacidade 0,24, `frames=1`: contato do mobiliário estático, não passagem contínua. Sem novo renderer, física ou pós-processamento. Não constitui simulação fotométrica. Limites: texturas fotografadas podem ter iluminação embutida, ausência de ambiente real medido, repetição do atlas ainda existe em áreas extensas.

## Recursos e falhas
Lazy após clique, poster SVG, probe WebGL2 liberado imediatamente, ErrorBoundary, fallback de contexto perdido e tentativa manual. Status por piso/parede e slug/orientação: loading/ready/error/procedural; callback cancelado não sobrescreve seleção nova. Falha de face mantém procedural explicitamente identificado.

Color map sRGB, anisotropia até 8 ou limite GPU, CanvasTexture própria descartada no cleanup. Demand loop; never fora da viewport/documento oculto. DPR 1–1,5, reduz a 1 após quatro submissões acima de 28 ms (heurística CPU, não benchmark GPU). Câmera discreta, sem animação contínua; reduced-motion global preservado. Teclado acessa controles HTML; fallback não impede orçamento.

## Verificação
Smoke de produção: nove materiais em ambas as superfícies, diferença de capturas do Canvas, identidade do Canvas/documento, orientação independente, luz/câmera, reset, orçamento, perda de contexto real via extensão e retry. Desktop 1440×1000, tablet 820×1180, mobile 390×844. Indisponibilidade WebGL simulada separadamente. Resultados finais e limites em UPDATE-QA.md.

Refinamento verificado com seis pares antes/depois de Madero/Monterrey/Savoy em 1440 e 390, câmera Ambiente/0°, mesma luz neutra, ambos piso/parede selecionados. Todos inspecionados. Bump/roughness elevam o número de texturas por superfície de uma para três; mapas auxiliares limitados a 512, cor a 2048. Contato tem custo de render target/depth/blur apenas na montagem. Sem benchmark GPU ou promessa de FPS; DPR/demand/lazy/fallback preservados e smoke aprovado após mudança.
