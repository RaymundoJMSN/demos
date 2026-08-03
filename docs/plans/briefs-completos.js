export const meta = {
  name: 'demos-profissionais',
  description: 'Gerar 12 paginas demo (8 landings, cardapio, catalogo QR, painel, hub) - so builds, sem revisores',
  phases: [
    { title: 'Build', detail: '1 agente por pagina, briefs esteticos distintos' },
  ],
}

const BASE = 'C:/Users/rayna/Soltos/demos-profissionais'
const WA = 'https://wa.me/5575999999999'
const PAGES = 'https://raymundojmsn.github.io/demos'

const CONV = [
  'CONVENCOES OBRIGATORIAS:',
  '- Arquivo unico index.html auto-contido (CSS e JS inline). Sem build, sem framework.',
  '- <!DOCTYPE html>, html lang="pt-BR", meta viewport, <title> especifico e vendedor.',
  '- Todo conteudo em portugues do Brasil. Nomes, enderecos e registros profissionais FICTICIOS e plausiveis (ex: CRM-BA 00000, CRO-BA 0000, OAB/BA 00.000, CRP 03/00000).',
  '- Mobile-first e responsivo de verdade (media queries; nav vira menu hamburger ou empilha).',
  '- Fontes via Google Fonts (link no head). PROIBIDO: Inter, Roboto, Arial, system-ui como fonte principal, Space Grotesk. Use EXATAMENTE as fontes do brief.',
  '- PROIBIDO gradiente roxo generico e estetica de template pronto. Comprometa-se 100% com a direcao estetica do brief: tipografia grande e intencional, composicao com personalidade (assimetria, sobreposicao, espaco negativo), micro-interacoes e uma animacao de entrada bem orquestrada (staggered reveal).',
  '- Nenhuma imagem externa (sem unsplash, sem stock). Retratos = avatar SVG/iniciais estilizadas; ilustracoes = SVG inline / CSS art. Excecao unica: QR code via api.qrserver.com quando o brief pedir.',
  '- Acessibilidade basica: contraste legivel, foco visivel, aria-label em botoes de icone, semantica (header/main/section/footer).',
  '- Footer discreto em toda pagina: "Modelo demonstrativo - Desenvolvido por Ray - raimundojmdsn@gmail.com".',
  '- Qualidade producao: sem lorem ipsum, textos reais de venda bem escritos; sem links quebrados (ancoras internas funcionam, todo href="#id" tem id correspondente).',
  '- Etica profissional: advogado sem promessa de resultado nem precos; psicologo sem depoimento identificado de paciente.',
].join('\n')

const LANDING = [
  'Secoes tipicas de landing (adapte a ordem ao design): nav fixa com ancoras; hero forte com headline + CTA; sobre o profissional (mini-bio + registro); servicos/especialidades em cards; diferenciais; 3 depoimentos ficticios; informacoes praticas (endereco ficticio, horarios, convenios quando area de saude); bloco final de CTA agendamento; footer.',
  'Botao WhatsApp flutuante fixo (canto inferior direito) apontando para ' + WA + ' com mensagem pre-preenchida via ?text=.',
].join('\n')

const SITES = [
  { slug: 'medico-1', name: 'Dr. Henrique Salles - Cardiologista', brief: [
    'Landing page de cardiologista, Dr. Henrique Salles (CRM ficticio). Publico: pacientes 40+, tom de confianca e sofisticacao.',
    'Estetica: luxo editorial CLARO. Paleta: marfim #FAF7F2 fundo, navy profundo #0E2A47 texto/blocos, dourado #C9A227 acentos e hairlines.',
    'Fontes: Fraunces (display, pesos altos, opsz) + Newsreader (body).',
    'Elemento assinatura: linha de ECG (eletrocardiograma) em SVG animada atravessando o hero (stroke-dashoffset). Numeros grandes em serifado (anos de experiencia, pacientes atendidos).',
    'Servicos: consulta cardiologica, check-up, ergometria, MAPA, holter, ecocardiograma. Convenios: Unimed, Bradesco Saude, SulAmerica, particular.',
    LANDING,
  ].join('\n') },
  { slug: 'medico-2', name: 'Dra. Marina Costa - Pediatra', brief: [
    'Landing page de pediatra, Dra. Marina Costa. Publico: maes e pais jovens, tom acolhedor e alegre sem ser infantil demais.',
    'Estetica: pastel ludico. Paleta: creme quente de fundo, coral #FF6F61, teal #2EC4B6, amarelo sol como acentos. Formas blob organicas flutuando no fundo (CSS/SVG), cantos bem arredondados.',
    'Fontes: Baloo 2 (display) + Nunito (body).',
    'Elemento assinatura: doodles SVG (estrela, nuvem, coracao, band-aid) espalhados com leve float animation; hover com micro-bounce nos cards.',
    'Servicos: puericultura, consultas de rotina, vacinacao orientada, teleconsulta, acompanhamento do desenvolvimento. Convenios: Unimed, Amil, particular.',
    LANDING,
  ].join('\n') },
  { slug: 'dentista-1', name: 'Clinica OdontoVita', brief: [
    'Landing page de clinica odontologica geral, OdontoVita (equipe, nao um dentista so). Tom: moderno, limpo, acessivel.',
    'Estetica: minimal clinico claro. Paleta: branco dominante, azul ceu #0EA5E9, menta #9EE7D8; muito espaco negativo, grid geometrico visivel.',
    'Fontes: Outfit (display) + Karla (body).',
    'Elemento assinatura: arco de sorriso em SVG como motivo grafico repetido (no hero e como divisor de secoes). Tabela/cards de planos com precos (Limpeza R$ 150, Clareamento R$ 690, Aparelho a partir de R$ 180/mes...).',
    'Servicos: clinica geral, limpeza, clareamento, ortodontia, implantes, odontopediatria. Convenios odontologicos: OdontoPrev, Amil Dental, particular.',
    LANDING,
  ].join('\n') },
  { slug: 'dentista-2', name: 'Atelier do Sorriso - Odontologia Estetica', brief: [
    'Landing page de odontologia estetica premium, Atelier do Sorriso. Publico: alto padrao, tom exclusivo.',
    'Estetica: dark luxury. Paleta: quase-preto #111111 fundo, champagne #E7D3A1 acentos, cinza-quente para texto secundario; hairlines dourados de 1px separando secoes.',
    'Fontes: Cormorant Garamond (display, italico nos destaques) + Jost (body).',
    'Elemento assinatura: comparador antes/depois em CSS puro (input range controlando clip-path sobre duas "fotos" feitas em SVG/gradiente estilizado - sem imagens reais). Reveal on scroll com IntersectionObserver.',
    'Servicos: lentes de contato dental, facetas, clareamento a laser, harmonizacao do sorriso, planejamento digital do sorriso. Atendimento particular apenas.',
    LANDING,
  ].join('\n') },
  { slug: 'advogado-1', name: 'Almeida & Rocha Advocacia', brief: [
    'Landing page de escritorio tradicional, Almeida & Rocha Advocacia (civil, trabalhista, familia). Tom: autoridade, tradicao, seriedade.',
    'Estetica: classico editorial. Paleta: papel creme de fundo, verde-escuro #1B3A2A dominante, latao/bronze como acento. Layout colunar tipo jornal/revista juridica, letra capitular no texto de abertura.',
    'Fontes: Libre Caslon Text (display e titulos) + Alegreya Sans (body).',
    'Elemento assinatura: brasao/monograma A&R em SVG; numeracao romana nas areas de atuacao; citacao juridica em destaque tipografico grande.',
    'Areas: direito civil, trabalhista, familia e sucessoes, contratos, consultivo empresarial. Secao equipe com 3 advogados ficticios (OAB ficticia).',
    LANDING,
  ].join('\n') },
  { slug: 'advogado-2', name: 'Prisma Juridico - Advocacia Digital', brief: [
    'Landing page de advocacia digital/moderna, Prisma Juridico (startups, LGPD, contratos digitais, direito do consumidor online). Publico jovem/empreendedor.',
    'Estetica: brutalist moderno. Paleta: fundo branco cru, texto preto, amarelo #FFD400 em blocos solidos; bordas pretas grossas (3-4px), sombras duras deslocadas (box-shadow sem blur), tipografia GIGANTE no hero.',
    'Fontes: Archivo (display, black/expanded) + IBM Plex Mono (labels, tags, detalhes).',
    'Elemento assinatura: faixa marquee animada com termos (LGPD * CONTRATOS * STARTUPS * CONSUMIDOR *); cards que deslocam a sombra no hover; numeracao estilo terminal (01/, 02/).',
    'Areas: LGPD e privacidade, contratos para startups, direito do consumidor digital, marcas e propriedade intelectual, consultoria juridica por assinatura.',
    LANDING,
  ].join('\n') },
  { slug: 'psicologo-1', name: 'Dra. Beatriz Lemos - Psicologa', brief: [
    'Landing page de psicologa clinica, Dra. Beatriz Lemos (CRP ficticio). Tom: calmo, acolhedor, humano.',
    'Estetica: organico/natural. Paleta: papel #F5F1EA fundo, salvia #87A08B, terracota #C67B5C; textura de grain sutil via SVG feTurbulence overlay; formas organicas (border-radius irregulares).',
    'Fontes: Lora (display) + Mulish (body).',
    'Elemento assinatura: circulo "respire" animado (expande/contrai em loop lento com texto inspire/expire) no hero ou como secao; folhagem SVG minimalista decorativa.',
    'Conteudo: abordagem (TCC), para quem e a terapia (ansiedade, luto, autoconhecimento, relacionamentos), como funciona a primeira sessao, atendimento presencial e online, FAQ em accordion (details/summary estilizado). Sem depoimentos de pacientes.',
    LANDING,
  ].join('\n') },
  { slug: 'psicologo-2', name: 'Ponto de Escuta - Terapia Online', brief: [
    'Landing page de plataforma/consultorio de terapia 100% online, Ponto de Escuta (2 psicologos ficticios). Publico: adultos ocupados, tom pratico e caloroso.',
    'Estetica: warm minimal. Paleta: areia #EFE6DA fundo, azul-poeira #5B7C99, texto tinta quase-preto; composicao arejada, assimetrica.',
    'Fontes: DM Serif Display (display) + Work Sans (body).',
    'Elemento assinatura: mock de janela de video-chamada feito em CSS (moldura de app com avatar SVG e controles) no hero; linha do tempo horizontal "como funciona" em 4 passos com scroll suave.',
    'Conteudo: como funciona (agendar, link seguro, sessao 50min), valores por sessao e pacotes (Sessao avulsa R$ 180, pacote mensal 4 sessoes R$ 640), sigilo e etica, para quem e, FAQ. Sem depoimentos identificados.',
    LANDING,
  ].join('\n') },
  { slug: 'cardapio', name: 'Brasa Burger - Cardapio Digital', brief: [
    'Cardapio digital de hamburgueria artesanal, Brasa Burger. Uso real: cliente abre pelo QR na mesa. Tom: fome, brasa, intensidade.',
    'Estetica: maximalista dark. Paleta: carvao #141210 fundo, laranja-fogo #FF5A1F, amarelo #FFC940; textura de ruido/brasa sutil; tipografia display condensada ENORME.',
    'Fontes: Anton (display) + Barlow (body).',
    'Estrutura: header com logo tipografico + status aberto/fechado (JS pela hora); abas de categoria sticky (Burgers, Acompanhamentos, Bebidas, Sobremesas) com scroll-to e destaque da aba ativa; cada item = card com nome, descricao apetitosa, preco, badges (MAIS PEDIDO, NOVO, PICANTE em amarelo); 4-6 itens por categoria com precos plausiveis.',
    'Extras: botao flutuante "Pedir no WhatsApp" (' + WA + ' com texto pre-preenchido); secao final "aponte a camera" com QR real: <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + PAGES + '/cardapio/" alt="QR Code do cardapio">; rodape com endereco e horario ficticios.',
  ].join('\n') },
  { slug: 'catalogo', name: 'Aura Semijoias - Catalogo', brief: [
    'Catalogo digital com QR de loja de semijoias, Aura Semijoias. Uso: dona da loja manda o link/QR para clientes escolherem e pedirem pelo WhatsApp.',
    'Estetica: catalogo refinado claro. Paleta: off-white/blush de fundo, grafite para texto, fio dourado como acento (bordas 1px, sublinhados).',
    'Fontes: Marcellus (display) + Figtree (body).',
    'Estrutura: hero curto elegante; chips de filtro por categoria (Todos, Colares, Brincos, Aneis, Pulseiras) filtrando o grid via JS (data-attributes); grid responsivo de 12-16 produtos, cada card com "foto" abstrata elegante (gradiente/SVG da joia estilizada - sem imagem real), nome poetico, preco, botao "Pedir no WhatsApp" (' + WA + '?text= com nome do produto pre-preenchido).',
    'Extras: contador de itens visiveis por filtro; secao QR real: <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + PAGES + '/catalogo/" alt="QR Code do catalogo">; nota "aceitamos Pix e cartao".',
  ].join('\n') },
  { slug: 'painel', name: 'AgendaPro - Painel de Agendamento (demo)', brief: [
    'Demo funcional de sistema de agendamento para clinicas, AgendaPro. Objetivo: mostrar a um cliente como seria o sistema dele. Tudo client-side com localStorage (chave agendapro-demo), dados seed criados no primeiro load, botao "Restaurar dados demo" no rodape da sidebar.',
    'Estetica: dashboard dark profissional. Paleta: fundo #0F172A, superficie #1E293B, acento ciano #22D3EE, sucesso lima #A3E635, texto slate claro. Fontes: Sora (tudo) com font-variant-numeric tabular nos numeros.',
    'Telas (SPA em um arquivo, troca por JS): 1) Login fake: escolher 1 de 3 profissionais ficticios em cards (Dra. Ana - Clinico Geral, Dr. Bruno - Dermatologia, Dra. Carla - Nutricao). 2) Layout app: sidebar (Agenda, Pacientes, Relatorios, sair) + topbar com data de hoje e nome do profissional.',
    'Agenda: visao semanal seg-sab, linhas de 08h as 18h, consultas como blocos coloridos por profissional; botao "+ Nova consulta" e clique em slot vazio abrem modal (paciente via select, procedimento, dia, hora, duracao); clicar numa consulta permite editar ou cancelar. Navegacao semana anterior/proxima.',
    'Pacientes: tabela com 12 pacientes seed (nome, telefone ficticio, ultima consulta, convenio), busca por nome filtrando ao digitar, botao novo paciente (modal simples).',
    'Relatorios: 4 stat cards (consultas na semana, taxa de ocupacao %, novos pacientes, faturamento estimado R$) calculados dos dados reais do localStorage + grafico de barras em CSS puro (consultas por dia da semana).',
    'Sem WhatsApp flutuante. Footer credit padrao dentro da sidebar ou tela de login. Capriche no polish: transicoes suaves, estados vazios bem desenhados, tudo funcional sem erro de console.',
  ].join('\n') },
  { slug: 'hub', name: 'Hub - Modelos & Demos', brief: [
    'Pagina-portfolio na RAIZ (index.html da raiz, nao em subpasta) listando os 11 demos. Dupla funcao: indice para o Ray e pagina de venda para mandar a clientes ("seu site assim em 48h").',
    'Estetica: galeria dark neutra com personalidade. Fundo grafite quase-preto, texto claro, UM acento vivo (ex: verde-eletrico ou laranja); nada de roxo.',
    'Fontes: Bricolage Grotesque (display) + Albert Sans (body).',
    'Hero: titulo forte ("Modelos prontos de sites profissionais"), subtitulo de venda (entrega rapida, mobile, hospedagem inclusa), CTA WhatsApp (' + WA + ') e email raimundojmdsn@gmail.com.',
    'Grid de cards, um por demo. Cada card: thumbnail ao vivo = iframe da propria pagina (src relativo tipo ./medico-1/, loading="lazy", dentro de wrapper com aspect-ratio 16/10, iframe com width:400%; height:400%; transform:scale(.25); transform-origin:0 0; pointer-events:none; border:0), titulo, tags (Landing - Saude / Juridico / Cardapio / Catalogo / Sistema), 3 dots com a paleta da demo, botao "Abrir demo" (link para a subpasta) + botao "copiar link" (navigator.clipboard com o URL ' + PAGES + '/<slug>/ e feedback visual).',
    'Lista dos demos (slug -> titulo -> paleta): medico-1 Dr. Henrique Salles Cardiologia (#FAF7F2 #0E2A47 #C9A227); medico-2 Dra. Marina Costa Pediatria (creme #FF6F61 #2EC4B6); dentista-1 Clinica OdontoVita (branco #0EA5E9 #9EE7D8); dentista-2 Atelier do Sorriso (#111111 #E7D3A1 cinza); advogado-1 Almeida & Rocha (creme #1B3A2A latao); advogado-2 Prisma Juridico (branco preto #FFD400); psicologo-1 Dra. Beatriz Lemos (#F5F1EA #87A08B #C67B5C); psicologo-2 Ponto de Escuta (#EFE6DA #5B7C99 tinta); cardapio Brasa Burger (#141210 #FF5A1F #FFC940); catalogo Aura Semijoias (off-white grafite dourado); painel AgendaPro (#0F172A #22D3EE #A3E635).',
    'Secao final curta "como funciona" (3 passos: escolhe o modelo, personalizo com seus dados, publico em 48h) + footer credit padrao.',
  ].join('\n') },
]

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    done: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['slug', 'done'],
}

function pathFor(s) {
  return s.slug === 'hub' ? BASE + '/index.html' : BASE + '/' + s.slug + '/index.html'
}

function buildPrompt(s) {
  return [
    'Voce e um designer/dev frontend de elite criando uma pagina demo de altissima qualidade visual para portfolio.',
    'Crie o arquivo COMPLETO em: ' + pathFor(s) + ' (use a ferramenta Write).',
    '',
    'BRIEF: ' + s.name,
    s.brief,
    '',
    CONV,
    '',
    'Antes de finalizar, releia seu proprio HTML procurando: ancora quebrada, JS com erro de sintaxe, fonte declarada mas nao usada. Corrija o que achar.',
    'Capriche de verdade: essa pagina sera mostrada a clientes reais como exemplo de trabalho. Uma pagina generica e um fracasso; uma pagina memoravel e o objetivo.',
    'Retorno final: JSON com slug="' + s.slug + '", done=true e notes curto (1 frase sobre o que fez de especial).',
  ].join('\n')
}

log('Gerando 12 paginas (1 agente por pagina, sem revisores)')

const results = await parallel(SITES.map((s) => () =>
  agent(buildPrompt(s), { label: 'build:' + s.slug, phase: 'Build', schema: BUILD_SCHEMA })
))

const clean = results.filter(Boolean)
log('Concluido: ' + clean.length + '/12 paginas')
return { paginas: clean }