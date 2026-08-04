import { writeFileSync } from 'node:fs';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;600;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:#0A0908;color:#F2EDE6;font-family:Manrope,sans-serif;overflow:hidden;position:relative}
body::before{content:"";position:absolute;inset:0;background:radial-gradient(900px 600px at 85% -10%,rgba(255,122,47,.16),transparent 60%),radial-gradient(700px 500px at -10% 110%,rgba(255,122,47,.07),transparent 60%)}
.pad{position:relative;z-index:1;height:100%;padding:64px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center}
.tag{display:inline-flex;align-items:center;gap:10px;border:1.5px solid rgba(255,122,47,.55);color:#FF9C63;border-radius:999px;padding:12px 24px;font-size:24px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
.tag::before{content:"";width:10px;height:10px;border-radius:50%;background:#FF7A2F}
.badge{font-size:24px;font-weight:800;letter-spacing:.14em;color:#8F8578;text-transform:uppercase}
.serif{font-family:'Instrument Serif',serif;font-weight:400}
.em{font-style:italic;color:#FF7A2F}
.center{margin:auto 0;display:flex;flex-direction:column;gap:34px}
.foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(242,237,230,.14);padding-top:34px;font-size:26px;color:#B8AFA3}
.foot b{color:#F2EDE6;font-weight:800}
.shotwrap{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;padding:44px 0}
.phone{height:100%;max-height:800px;aspect-ratio:390/844;border-radius:38px;border:10px solid #1E1A16;box-shadow:0 40px 90px -30px rgba(0,0,0,.9),0 0 0 1.5px rgba(255,122,47,.25);overflow:hidden;transform:rotate(-1.6deg);background:#111}
.phone img{width:100%;height:100%;object-fit:cover;object-position:top}
.browser{width:100%;border-radius:22px;border:1.5px solid rgba(242,237,230,.16);box-shadow:0 40px 90px -30px rgba(0,0,0,.9);overflow:hidden;transform:rotate(-1.2deg);background:#141210}
.bbar{display:flex;align-items:center;gap:9px;padding:16px 20px;background:#1E1A16}
.bdot{width:13px;height:13px;border-radius:50%;background:#3A342D}
.burl{margin:0 auto;background:#0A0908;border-radius:999px;padding:7px 26px;font-size:19px;color:#8F8578}
.browser img{width:100%;display:block}
.caption{margin-bottom:34px}
.title{font-size:58px;line-height:1.12;margin-bottom:10px}
.sub{font-size:29px;color:#B8AFA3}
.h-hero{font-size:96px;line-height:1.06}
.chips{display:flex;flex-wrap:wrap;gap:16px}
.chip{border:1.5px solid rgba(242,237,230,.22);border-radius:999px;padding:14px 28px;font-size:28px;font-weight:600;color:#DED7CC}
.chip.hot{border-color:rgba(255,122,47,.6);color:#FF9C63}
.list{display:flex;flex-direction:column;gap:26px}
.item{display:flex;gap:22px;align-items:flex-start}
.item .n{font-family:'Instrument Serif',serif;font-size:54px;color:#FF7A2F;line-height:1;min-width:64px}
.item h3{font-size:34px;margin-bottom:6px}
.item p{font-size:26px;color:#B8AFA3;line-height:1.45}
.bigline{font-size:44px;line-height:1.35;color:#DED7CC}
.bigline b{color:#FF7A2F;font-weight:800}
`;

const page = (body) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`;
const foot = `<div class="foot"><span><b>@raymundneto</b></span><span>portifolio.raynathus.com.br</span></div>`;
const top = (tag, badge) => `<div class="top"><span class="tag">${tag}</span><span class="badge">${badge}</span></div>`;

const frames = [];

const sites = [
  ['medico-1', 'MODELO · SAÚDE', 'Cardiologia', 'Landing sofisticada, com agendamento no WhatsApp.'],
  ['medico-2', 'MODELO · SAÚDE', 'Pediatria', 'Acolhedor pros pais, direto pro agendamento.'],
  ['dentista-1', 'MODELO · SAÚDE', 'Clínica Odontológica', 'Serviços, equipe e preços claros.'],
  ['dentista-2', 'MODELO · SAÚDE', 'Odontologia Estética', 'Premium, com comparador antes e depois.'],
  ['advogado-1', 'MODELO · JURÍDICO', 'Advocacia Tradicional', 'Autoridade e sobriedade, dentro das normas da OAB.'],
  ['advogado-2', 'MODELO · JURÍDICO', 'Advocacia Digital', 'Pra quem atende startups e consumidor online.'],
  ['psicologo-1', 'MODELO · SAÚDE', 'Psicologia Clínica', 'Calmo, humano, com respiração guiada.'],
  ['psicologo-2', 'MODELO · SAÚDE', 'Terapia Online', 'Sessões por vídeo, valores e FAQ transparentes.'],
  ['cardapio', 'MODELO · COMÉRCIO', 'Cardápio Digital', 'QR na mesa, pedido direto no WhatsApp.'],
  ['catalogo', 'MODELO · COMÉRCIO', 'Catálogo com QR', 'Filtros por categoria e pedido em um toque.'],
];
for (const [slug, tag, nome, sub] of sites) {
  frames.push([`site-${slug}`, page(`<div class="pad">
    ${top(tag, 'No ar em 48h')}
    <div class="shotwrap"><div class="phone"><img src="../shots/${slug}.png"></div></div>
    <div class="caption"><div class="title serif">${nome}</div><div class="sub">${sub}</div></div>
    ${foot}
  </div>`)]);
}

frames.push(['sistema-painel', page(`<div class="pad">
  ${top('SISTEMA SOB MEDIDA', 'Web · com login')}
  <div class="shotwrap"><div class="browser"><div class="bbar"><span class="bdot"></span><span class="bdot"></span><span class="bdot"></span><span class="burl">agendapro — demo ao vivo</span></div><img src="../shots/painel.png"></div></div>
  <div class="caption"><div class="title serif">AgendaPro — agenda pra clínicas</div><div class="sub">Consultas, pacientes e relatórios. Feito pro seu fluxo, não pro genérico.</div></div>
  ${foot}
</div>`)]);

frames.push(['card-apresentacao', page(`<div class="pad">
  ${top('RAY · PROGRAMADOR', 'Feira de Santana → BR')}
  <div class="center">
    <h1 class="serif h-hero">Transformo ideia<br>em <span class="em">realidade</span>.</h1>
    <div class="chips"><span class="chip hot">Sites em 48h</span><span class="chip">Sistemas web</span><span class="chip">Apps Android</span><span class="chip">Automações</span><span class="chip">Ferramentas de RPG</span></div>
  </div>
  ${foot}
</div>`)]);

frames.push(['card-apps', page(`<div class="pad">
  ${top('PROJETO · APP ANDROID', 'Código aberto')}
  <div class="center">
    <h1 class="serif h-hero" style="font-size:76px">Um app Android<br>de <span class="em">verdade</span>, do zero.</h1>
    <div class="bigline">Cliente mobile pra mesa de RPG virtual: <b>APK instalável</b>, tela cheia imersiva e <b>atualização automática</b> fora da Play Store — com build assinado e CI no GitHub.</div>
  </div>
  ${foot}
</div>`)]);

frames.push(['card-opensource', page(`<div class="pad">
  ${top('OPEN SOURCE · RPG', 'github.com/RaymundoJMSN')}
  <div class="center">
    <h1 class="serif h-hero" style="font-size:76px">Ferramentas que a<br>comunidade <span class="em">usa</span>.</h1>
    <div class="list">
      <div class="item"><span class="n">01</span><div><h3>Ficha online em tempo real</h3><p>PWA que espelha a ficha do jogador — funciona até offline.</p></div></div>
      <div class="item"><span class="n">02</span><div><h3>Tradução pt-BR de Call of Cthulhu</h3><p>Interface e compêndios do sistema pro Foundry VTT.</p></div></div>
      <div class="item"><span class="n">03</span><div><h3>Exportadores e módulos</h3><p>Fichas em PDF, backup em ZIP, melhorias pro Tormenta 20.</p></div></div>
    </div>
  </div>
  ${foot}
</div>`)]);

frames.push(['card-processo', page(`<div class="pad">
  ${top('COMO FUNCIONA', 'Zero risco')}
  <div class="center">
    <h1 class="serif h-hero" style="font-size:72px">Você vê pronto<br><span class="em">antes</span> de pagar.</h1>
    <div class="list">
      <div class="item"><span class="n">1</span><div><h3>Me chama no WhatsApp</h3><p>Conta do teu negócio em cinco minutos.</p></div></div>
      <div class="item"><span class="n">2</span><div><h3>Recebe a prévia de graça</h3><p>Site montado com a tua cara, sem pagar nada ainda.</p></div></div>
      <div class="item"><span class="n">3</span><div><h3>Aprovou, ajustamos</h3><p>Texto, cores e fotos do jeito que você quer.</p></div></div>
      <div class="item"><span class="n">4</span><div><h3>No ar em até 48h</h3><p>Com teu domínio, certificado e tudo funcionando.</p></div></div>
    </div>
  </div>
  ${foot}
</div>`)]);

for (const [name, html] of frames) writeFileSync(`C:/Users/rayna/Soltos/demos-profissionais/insta/frames/${name}.html`, html);
console.log('gerados: ' + frames.length);
