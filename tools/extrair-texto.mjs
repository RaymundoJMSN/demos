/* Extrai o texto visível de cada página pra revisão de copy.
   Roda em Node (sem browser): `node tools/extrair-texto.mjs`
   Saída: docs/auditoria/texto/<slug>.txt — é isso que o agente de copy lê,
   em vez dos ~30k de HTML de cada página. */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const saida = join(raiz, 'docs', 'auditoria', 'texto');
mkdirSync(saida, { recursive: true });

const paginas = [['portfolio', 'index.html']];
for (const nome of readdirSync(raiz)) {
  if (nome.startsWith('.') || nome === 'docs' || nome === 'tools' || nome === 'insta') continue;
  const alvo = join(raiz, nome, 'index.html');
  try { statSync(alvo); paginas.push([nome, join(nome, 'index.html')]); } catch { }
}
try {
  for (const cli of readdirSync(join(raiz, 'previas'))) {
    const alvo = join(raiz, 'previas', cli, 'index.html');
    try { statSync(alvo); paginas.push(['previa-' + cli, join('previas', cli, 'index.html')]); } catch { }
  }
} catch { }

for (const [slug, rel] of paginas) {
  const html = readFileSync(join(raiz, rel), 'utf8');
  const txt = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(p|div|section|h[1-6]|li|br|tr|article|header|footer|nav)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    // Decodificar TODAS as entidades nomeadas usadas nas páginas. Sem isso,
    // `&thinsp;` e `&middot;` vazavam literais pro .txt e o revisor de copy
    // reportava "entidade quebrada" numa página que renderiza perfeitamente.
    .replace(/&(nbsp|thinsp|ensp|emsp|middot|bull|hellip|ndash|mdash|laquo|raquo|ldquo|rdquo|lsquo|rsquo|times|deg|reg|copy|trade|aacute|agrave|acirc|atilde|eacute|ecirc|iacute|oacute|ocirc|otilde|uacute|ccedil|Aacute|Acirc|Atilde|Eacute|Ecirc|Iacute|Oacute|Ocirc|Otilde|Uacute|Ccedil);/g,
      (_, n) => ({ nbsp: ' ', thinsp: ' ', ensp: ' ', emsp: ' ', middot: '·', bull: '•', hellip: '…', ndash: '–', mdash: '—', laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', times: '×', deg: '°', reg: '®', copy: '©', trade: '™', aacute: 'á', agrave: 'à', acirc: 'â', atilde: 'ã', eacute: 'é', ecirc: 'ê', iacute: 'í', oacute: 'ó', ocirc: 'ô', otilde: 'õ', uacute: 'ú', ccedil: 'ç', Aacute: 'Á', Acirc: 'Â', Atilde: 'Ã', Eacute: 'É', Ecirc: 'Ê', Iacute: 'Í', Oacute: 'Ó', Ocirc: 'Ô', Otilde: 'Õ', Uacute: 'Ú', Ccedil: 'Ç' }[n]))
    .replace(/&(amp|quot|apos|lt|gt);/g, (_, n) => ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[n]))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
  writeFileSync(join(saida, slug + '.txt'), txt);
  console.log(String(txt.split(/\s+/).length).padStart(6), 'palavras  ', slug);
}
console.log('\n' + paginas.length + ' páginas → docs/auditoria/texto/');
