# Demos Profissionais — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development (executado via Workflow, 1 agente por página + 1 verificador por página).

**Goal:** 12 páginas demo publicadas com links reais (GitHub Pages) para usar como portfólio/mockup ao prospectar clientes: 8 landing pages (2 médico, 2 dentista, 2 advogado, 2 psicólogo), 1 cardápio digital, 1 catálogo com QR, 1 painel de agendamento, 1 hub-portfólio.

**Architecture:** Cada demo = 1 arquivo `index.html` auto-contido (CSS/JS inline) na sua subpasta. Sem build, sem framework, sem servidor — GitHub Pages serve estático. Hub na raiz linka tudo com thumbnails por iframe escalado.

**Tech Stack:** HTML/CSS/JS puro. Única dependência externa: Google Fonts (+ api.qrserver.com para QR real no cardápio/catálogo). Deploy: repo público `RaymundoJMSN/demos` + GitHub Pages (branch main).

---

## Estrutura de arquivos

```
demos-profissionais/
├── index.html               # hub-portfólio (raiz do Pages)
├── medico-1/index.html      # cardiologista — luxo editorial
├── medico-2/index.html      # pediatra — pastel lúdico
├── dentista-1/index.html    # clínica geral — minimal clínico claro
├── dentista-2/index.html    # estética dental — dark luxury
├── advogado-1/index.html    # escritório tradicional — clássico editorial
├── advogado-2/index.html    # advocacia digital — brutalist moderno
├── psicologo-1/index.html   # psicóloga clínica — orgânico/natural
├── psicologo-2/index.html   # terapia online — warm minimal
├── cardapio/index.html      # hamburgueria — maximalista dark
├── catalogo/index.html      # semijoias — catálogo refinado + QR
├── painel/index.html        # AgendaPro — dashboard dark, localStorage
└── docs/plans/              # este plano
```

## Convenções (todas as páginas)

- `<!DOCTYPE html>`, `lang="pt-BR"`, `<meta name="viewport">`, `<title>` específico.
- Todo conteúdo em pt-BR, nomes/endereços **fictícios** e plausíveis.
- Mobile-first, responsivo. Botão WhatsApp flutuante (`https://wa.me/5575999999999` placeholder) nas landings/cardápio/catálogo.
- Footer discreto em todas: `Modelo demonstrativo · Desenvolvido por Ray — raimundojmdsn@gmail.com`.
- Nenhuma imagem externa: ilustrações via SVG inline/CSS (exceção: QR via api.qrserver.com apontando pro URL final da própria página).
- Fontes: Google Fonts, **nenhuma repetida entre páginas**; proibido Inter/Roboto/Arial/system e roxo-gradiente-clichê (regra frontend-design).
- Acessibilidade básica: contraste ok, alt/aria em interativos, foco visível.

## Briefs por página (Task 1–12, paralelizáveis)

| # | Slug | Persona | Direção estética | Paleta | Fontes (display + body) | Componentes-chave |
|---|------|---------|-----------------|--------|------------------------|-------------------|
| 1 | medico-1 | Dr. Henrique Salles, cardiologista | Luxo editorial claro | Marfim #FAF7F2, navy #0E2A47, dourado #C9A227 | Fraunces + Newsreader | Hero c/ linha de ECG animada (SVG), especialidades, convênios, depoimentos, CTA agendar |
| 2 | medico-2 | Dra. Marina Costa, pediatra | Pastel lúdico | Creme, coral #FF6F61, teal #2EC4B6, amarelo | Baloo 2 + Nunito | Blobs flutuantes, doodles SVG (nuvem/estrela), cards arredondados, micro-bounce |
| 3 | dentista-1 | Clínica OdontoVita | Minimal clínico claro | Branco, azul #0EA5E9, menta #9EE7D8 | Outfit + Karla | Grid geométrico, arco de sorriso SVG, tabela de planos/preços, nav sticky |
| 4 | dentista-2 | Atelier do Sorriso (estética) | Dark luxury | Quase-preto #111, champagne #E7D3A1 | Cormorant Garamond + Jost | Slider antes/depois em CSS, hairlines dourados, reveal on scroll |
| 5 | advogado-1 | Almeida & Rocha Advocacia | Clássico autoridade | Papel creme, verde-escuro #1B3A2A, latão | Libre Caslon Text + Alegreya Sans | Layout colunar editorial, capitular, áreas de atuação, equipe, OAB no footer |
| 6 | advogado-2 | Prisma Jurídico (digital) | Brutalist moderno | Branco, preto, amarelo #FFD400 | Archivo + IBM Plex Mono | Bordas grossas, sombras duras, tipografia gigante, faixa marquee |
| 7 | psicologo-1 | Dra. Beatriz Lemos, psicóloga | Orgânico/natural | Sálvia #87A08B, terracota #C67B5C, papel #F5F1EA + grain | Lora + Mulish | Círculo "respire" animado, abordagens, FAQ accordion |
| 8 | psicologo-2 | Ponto de Escuta (terapia online) | Warm minimal | Areia #EFE6DA, azul-poeira #5B7C99, tinta | DM Serif Display + Work Sans | Passos "como funciona", planos de sessão, mock de vídeo-chamada em CSS |
| 9 | cardapio | Brasa Burger (hamburgueria) | Maximalista dark | Carvão, laranja-fogo #FF5A1F, amarelo #FFC940 | Anton (ou Archivo Black) + Barlow | Abas de categoria, cards com preço/badges, seção QR real, pedido via WhatsApp |
| 10 | catalogo | Aura Semijoias | Catálogo refinado claro | Off-white/blush, grafite, fio dourado | Marcellus + Figtree | Chips de filtro por categoria (JS), grid de produtos, "Pedir no WhatsApp" com texto pré-preenchido, QR real |
| 11 | painel | AgendaPro — Clínica Demo | Dashboard dark | #0F172A, ciano #22D3EE, lima #A3E635 | Sora (+ números tabulares) | Login fake (escolher profissional), agenda semanal em grid, modal novo agendamento, pacientes seed, stats + gráfico de barras CSS, persistência localStorage |
| 12 | hub (raiz) | Portfólio "Modelos & Demos" | Galeria dark neutra | Grafite + acento vivo | Bricolage Grotesque + body sans distinta | Card por demo com thumbnail = iframe `transform: scale(.25)` (pointer-events none), tags, paleta em dots, botão abrir |

QR das páginas 9–10: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://raymundojmsn.github.io/demos/<slug>/`.

### Passos por task (mesmo padrão para 1–12)

- [ ] Escrever `demos-profissionais/<slug>/index.html` completo seguindo o brief + convenções.
- [ ] Verificação (agente separado): doctype/lang/viewport/title, pt-BR, responsivo (media queries presentes), WhatsApp flutuante onde aplicável, footer demonstrativo, fontes corretas e exclusivas, zero imagens externas fora do permitido, JS sem erro de sintaxe (painel: seed + localStorage funcionam). Corrigir no ato o que falhar.

## Task 13: Deploy

- [ ] `git init` em `demos-profissionais/`, commit inicial.
- [ ] `gh repo create RaymundoJMSN/demos --public --source . --push`.
- [ ] Ativar Pages: `gh api repos/RaymundoJMSN/demos/pages -X POST -f "source[branch]=main" -f "source[path]=/"`.
- [ ] Aguardar build (~1 min) e conferir `https://raymundojmsn.github.io/demos/` + amostras no browser.
- [ ] Entregar lista de links ao usuário.

## Status e como continuar (handoff — funciona em qualquer modelo/sessão)

**Regra de execução: 1 página por vez** (nada em paralelo — cada página termina e salva antes da próxima, pra acompanhar o gasto de limite).

Briefs completos + prompt de build: [`briefs-completos.js`](briefs-completos.js) (mesma pasta) — array `SITES` tem o brief detalhado de cada slug; função `buildPrompt` tem o template exato do prompt. Para cada página pendente: montar o prompt (brief + convenções, como em `buildPrompt`), gerar o `index.html` completo no caminho da tabela de estrutura, depois verificar com:

```
grep -c -E 'lang="pt-BR"|name="viewport"|wa\.me/5575999999999|Modelo demonstrativo|@media' <slug>/index.html
```

(≥5 ocorrências = convenções básicas ok; painel e hub não precisam do wa.me flutuante.)

**TUDO CONCLUÍDO E PUBLICADO** em 2026-08-03. As 12 páginas estão no ar (HTTP 200 verificado) em `https://raymundojmsn.github.io/demos/`, repo `RaymundoJMSN/demos`, Pages ativo (branch main, raiz).

- [x] medico-1, medico-2, dentista-1, dentista-2, advogado-1, advogado-2
- [x] psicologo-1, psicologo-2, cardapio, catalogo, painel, hub (raiz)
- [x] Deploy: repo criado, push, Pages built, 12/12 respondendo 200

Para republicar após editar qualquer página: `git add -A && git commit -m "..." && git push` (Pages rebuilda sozinho em ~1 min).

## Fora de escopo (YAGNI)

- Backend real do painel (localStorage basta pra demo; Node+devilsworks quando houver cliente pagante).
- Domínio próprio (`demos.raynathus.com.br` = DNS manual + certbot; migrar depois se quiser — Pages aceita CNAME).
- Fotos reais/stock — SVG/CSS resolve e evita licença.
