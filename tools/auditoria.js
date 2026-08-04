/* Auditoria de página — cola no console ou injeta via Browser MCP.
   Define window.__auditar(); chamar retorna o relatório em JSON.
   Roda in-page porque precisa de estilo computado, clique real e caret real. */
(function () {
  'use strict';

  var NUM_HINT = /(tel|fone|celular|whats|cpf|cnpj|cep|data|nascimento|valor|preco|preço|numero|número|cart|rg|idade|quantidade|qtd)/i;
  var EXTERNO = /^(https?:|mailto:|tel:|whatsapp:)/i;

  function seletor(el) {
    if (!el || el === document.body) return 'body';
    if (el.id) return '#' + el.id;
    var p = el.tagName.toLowerCase();
    if (el.className && typeof el.className === 'string') {
      p += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
    }
    var pai = el.parentElement;
    if (pai && pai !== document.body) {
      var irmaos = Array.prototype.filter.call(pai.children, function (c) { return c.tagName === el.tagName; });
      if (irmaos.length > 1) p += ':nth-of-type(' + (irmaos.indexOf(el) + 1) + ')';
    }
    return p;
  }

  function texto(el) {
    return (el.textContent || el.value || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  }

  function interativo(el) {
    if (/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY|LABEL|DETAILS|OPTION)$/.test(el.tagName)) return true;
    if (el.hasAttribute('href') || el.hasAttribute('onclick') || el.hasAttribute('data-close')) return true;
    var r = el.getAttribute('role');
    if (r && /^(button|link|tab|checkbox|radio|menuitem|switch|option)$/.test(r)) return true;
    if (el.tabIndex >= 0) return true;
    return false;
  }

  /* ---------- cor / contraste ---------- */
  function rgb(s) {
    var m = /rgba?\(([^)]+)\)/.exec(s || '');
    if (!m) return null;
    var v = m[1].split(',').map(parseFloat);
    return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 };
  }
  function lum(c) {
    var f = [c.r, c.g, c.b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
  }
  // Sobe a árvore até achar um fundo opaco. Gradiente conta: usa a 1ª cor dele
  // (sem isso, botão com linear-gradient parece ter fundo transparente e o
  // contraste é medido contra a página — falso positivo garantido).
  function fundoReal(el) {
    var n = el;
    while (n && n !== document.documentElement) {
      var cs = getComputedStyle(n);
      var c = rgb(cs.backgroundColor);
      if (c && c.a > 0.85) return c;
      var bi = cs.backgroundImage;
      if (bi && bi !== 'none') {
        if (bi.indexOf('gradient') >= 0) {
          // Só vale a parada de cor que realmente cobre o que está atrás. Textura
          // decorativa (rgba(...,.05)) não é fundo — continua subindo, senão o
          // texto acaba comparado com ele mesmo e dá 1.00:1.
          var paradas = bi.match(/rgba?\([^)]+\)/g) || [];
          for (var i = 0; i < paradas.length; i++) {
            var g = rgb(paradas[i]);
            if (g && g.a > 0.85) return g;
          }
        } else {
          return null; // imagem de fundo: não dá pra medir, melhor não chutar
        }
      }
      n = n.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  }
  function razao(a, b) {
    var l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  /* ---------- checagens ---------- */

  // Elemento que reage ao hover (sobe, ganha sombra/borda) mas não faz nada. Bug do cardápio.
  function falsaAffordance(add) {
    var suspeitos = new Set();
    Array.prototype.forEach.call(document.styleSheets, function (folha) {
      var regras;
      try { regras = folha.cssRules; } catch (e) { return; }
      Array.prototype.forEach.call(regras || [], function (r) {
        if (!r.selectorText || r.selectorText.indexOf(':hover') < 0) return;
        // Só levantar/sombrear promete clique. Mudar só o fundo é auxílio de
        // leitura (linha de tabela, item de lista) e não é falsa promessa.
        var s = r.style;
        if (!(s.transform || s.boxShadow || s.cursor)) return;
        r.selectorText.split(',').forEach(function (sel) {
          if (sel.indexOf(':hover') < 0) return;
          var base = sel.replace(/:hover/g, '').trim();
          if (!base) return;
          var els;
          try { els = document.querySelectorAll(base); } catch (e) { return; }
          Array.prototype.forEach.call(els, function (el) {
            if (interativo(el)) return;
            if (el.querySelector('a,button,input,select,textarea,[role=button],[onclick]')) return;
            // ícone dentro de botão herda o :hover do pai — não é falsa promessa
            if (el.closest('a,button,[role=button],[onclick],summary,label,details')) return;
            suspeitos.add(el);
          });
        });
      });
    });
    // Grau importa: cursor:pointer é promessa explícita (o ponteiro vira mãozinha)
    // e cai em cursorMentiroso como 'alto'. Só o levantar no hover é ambíguo —
    // pode ser enfeite proposital. Reporta como 'medio' pra decisão humana.
    suspeitos.forEach(function (el) {
      if (getComputedStyle(el).cursor === 'pointer') return; // cursorMentiroso pega
      add('medio', 'falsa-affordance',
        'Sobe/muda no hover como card clicável, mas não tem ação: "' + texto(el) + '"', el);
    });
  }

  // cursor:pointer em coisa não clicável — mesma família, sintoma mais explícito
  function cursorMentiroso(add) {
    Array.prototype.forEach.call(document.querySelectorAll('body *'), function (el) {
      if (interativo(el)) return;
      if (getComputedStyle(el).cursor !== 'pointer') return;
      if (el.closest('a,button,[role=button],[onclick],summary,label,details')) return;
      add('alto', 'falsa-affordance', 'cursor:pointer sem ação: "' + texto(el) + '"', el);
    });
  }

  // Hash de conteúdo, não comprimento: trocar o filtro ativo move os mesmos
  // atributos (hidden, aria-pressed) de um card pro outro — string diferente,
  // comprimento idêntico. Comparar tamanho dava botão vivo como morto.
  function impressao() {
    var s = document.body.innerHTML, h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return h + '|' + location.href + '|' + window.scrollY + '|' + s.length;
  }

  // Botão que não muda nada ao ser clicado.
  function botaoMorto(add) {
    var alvos = document.querySelectorAll('button,[role=button],.btn:not(a),[data-pro],[onclick]');
    var mortos = [], vivosPorClasse = {};
    Array.prototype.forEach.call(alvos, function (el) {
      if (el.disabled || !el.offsetParent) return;
      var antes = impressao();
      try { el.click(); } catch (e) { return; }
      var classe = el.className || el.tagName;
      if (impressao() === antes) mortos.push({ el: el, classe: classe });
      else vivosPorClasse[classe] = true;
    });
    mortos.forEach(function (m) {
      // Se outros controles iguais responderam, este provavelmente só já estava
      // no estado que ativa (ex.: clicar em "Todos" com "Todos" já selecionado).
      var irmaoVivo = vivosPorClasse[m.classe];
      add(irmaoVivo ? 'baixo' : 'alto', 'botao-morto',
        'Clique não produziu efeito' + (irmaoVivo ? ' (outros ".' + m.classe + '" responderam — provavelmente já estava ativo)' : ' nenhum') +
        ': "' + texto(m.el) + '"', m.el);
    });
  }

  // Link externo: não clicar, só relatar destino pra conferência.
  function linksExternos(add) {
    Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (a) {
      var h = a.getAttribute('href');
      if (!EXTERNO.test(h)) return;
      var wa = /wa\.me\/(\d+)/.exec(h);
      if (wa) {
        add('info', 'link-externo', 'WhatsApp → ' + wa[1] + (/[?&]text=/.test(h) ? ' (com texto)' : ' (SEM texto pré-pronto)'), a);
      } else {
        add('info', 'link-externo', h.slice(0, 90), a);
      }
      if (a.target === '_blank' && !/noopener/.test(a.rel || '')) {
        add('baixo', 'seguranca', 'target=_blank sem rel=noopener', a);
      }
    });
  }

  // Âncora #destino que não existe.
  function ancoras(add) {
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      if (!document.getElementById(id) && !document.querySelector('[name="' + id + '"]')) {
        add('alto', 'ancora-quebrada', 'href="#' + id + '" não tem destino', a);
      }
    });
  }

  // Campos: máscara, teclado, filtro numérico, caret.
  function campos(add) {
    var ins = document.querySelectorAll('input:not([type=hidden]):not([type=range]):not([type=checkbox]):not([type=radio]),textarea');
    Array.prototype.forEach.call(ins, function (el) {
      var alvo = seletor(el);
      var rot = (el.labels && el.labels[0] ? el.labels[0].textContent : '') + ' ' +
        (el.placeholder || '') + ' ' + (el.id || '') + ' ' + (el.name || '') + ' ' + (el.getAttribute('aria-label') || '');
      var numerico = NUM_HINT.test(rot) || el.type === 'tel' || el.type === 'number';

      if (!el.labels || !el.labels.length) {
        if (!el.getAttribute('aria-label')) add('medio', 'a11y', 'Campo sem label associado', el);
      }
      if (numerico && !el.getAttribute('inputmode') && el.type !== 'number' && el.type !== 'tel') {
        add('medio', 'teclado', 'Campo numérico sem inputmode — celular abre teclado de letras', el);
      }
      if (numerico && !el.getAttribute('maxlength')) {
        add('baixo', 'validacao', 'Campo numérico sem maxlength', el);
      }

      var original = el.value;

      // 1. aceita letra onde só deveria haver número?
      if (numerico) {
        digitar(el, 'abcdef');
        var vivo = document.getElementById(el.id) || el;
        if (/[a-z]/i.test(vivo.value)) {
          add('alto', 'sem-filtro', 'Aceita letras num campo numérico (' + (el.placeholder || el.type) + ')', el);
        }
        restaura(el, original);
      }

      // 2. máscara: placeholder promete formato, valor sai cru?
      // Exige dígito + separador + dígito. Só procurar pontuação fazia
      // "Buscar por nome..." parecer promessa de máscara por causa das reticências.
      var prometeFormato = /\d[\s()\/.-]+\d/.test(el.placeholder || '');
      if (numerico || prometeFormato) {
        digitar(el, '71988887777');
        var v2 = (document.getElementById(el.id) || el).value;
        if (/^\d+$/.test(v2) && prometeFormato) {
          add('alto', 'sem-mascara', 'Placeholder "' + el.placeholder + '" promete formatação, mas o valor fica cru: "' + v2 + '"', el);
        }
        restaura(el, original);
      }

      // 3. caret: o handler recria o campo? (bug da busca do painel)
      digitar(el, 'ab');
      if (!el.isConnected) {
        var novo = el.id ? document.getElementById(el.id) : null;
        var pos = novo ? novo.selectionStart : null;
        add(pos === 0 ? 'alto' : 'medio', 'caret',
          'O campo é recriado no DOM a cada tecla' +
          (pos === 0 ? ' e o cursor volta pra posição 0 — texto digitado ao contrário' : ' (cursor em ' + pos + ')'), el);
      }
      restaura(el, original);
    });
  }

  function digitar(el, txt) {
    try {
      el.focus();
      var proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement : HTMLInputElement;
      var set = Object.getOwnPropertyDescriptor(proto.prototype, 'value').set;
      for (var i = 0; i < txt.length; i++) {
        var alvo = el.isConnected ? el : (el.id ? document.getElementById(el.id) : null);
        if (!alvo) return;
        set.call(alvo, alvo.value + txt[i]);
        alvo.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } catch (e) { /* campo protegido, ignora */ }
  }
  function restaura(el, v) {
    try {
      var alvo = el.isConnected ? el : (el.id ? document.getElementById(el.id) : null);
      if (!alvo) return;
      var proto = alvo.tagName === 'TEXTAREA' ? HTMLTextAreaElement : HTMLInputElement;
      Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(alvo, v);
      alvo.dispatchEvent(new Event('input', { bubbles: true }));
    } catch (e) { }
  }

  // Contraste WCAG em texto e em botão.
  function contraste(add) {
    var vistos = 0;
    Array.prototype.forEach.call(document.querySelectorAll('body *'), function (el) {
      if (vistos > 1200) return;
      if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return;
      var direto = Array.prototype.some.call(el.childNodes, function (n) {
        return n.nodeType === 3 && n.textContent.trim().length > 1;
      });
      if (!direto) return;
      vistos++;
      var cs = getComputedStyle(el);
      var fg = rgb(cs.color);
      if (!fg || fg.a < 0.5) return;
      var bg = fundoReal(el);
      if (!bg) return;
      var r = razao(fg, bg);
      var tam = parseFloat(cs.fontSize);
      var grande = tam >= 24 || (tam >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
      var min = grande ? 3 : 4.5;
      if (r < min) {
        add(r < 3 ? 'alto' : 'medio', 'contraste',
          'Contraste ' + r.toFixed(2) + ':1 (mínimo ' + min + ') — "' + texto(el) + '"', el);
      }
    });
  }

  // CTA da nav sendo pintado por regra genérica `.menu a`.
  function ctaNav(add) {
    var navBtns = document.querySelectorAll('nav .btn, header .btn, .menu .btn, .nav-links .btn');
    Array.prototype.forEach.call(navBtns, function (b) {
      var cs = getComputedStyle(b);
      var bg = rgb(cs.backgroundColor);
      if (!bg || bg.a < 0.1) return;
      var r = razao(rgb(cs.color), bg);
      if (r < 3) add('alto', 'contraste', 'CTA da nav ilegível (' + r.toFixed(2) + ':1) — regra genérica venceu .btn', b);
    });
  }

  // Animação de entrada presa = página em branco no iframe do portfólio.
  // Só conta o que está DENTRO da viewport: bloco abaixo da dobra com opacity 0
  // é reveal normal esperando o scroll, não defeito.
  function revealPreso(add) {
    var alt = window.innerHeight, presos = 0, exemplo = null;
    Array.prototype.forEach.call(document.querySelectorAll('body *'), function (el) {
      var r = el.getBoundingClientRect();
      if (r.height < 40 || r.bottom < 0 || r.top > alt) return;
      if (parseFloat(getComputedStyle(el).opacity) < 0.05) { presos++; exemplo = exemplo || el; }
    });
    if (presos > 2) {
      add('alto', 'reveal', presos + ' blocos visíveis na tela com opacity≈0 — animação de entrada presa', exemplo);
    }
  }

  // O portfólio mostra os demos em <iframe>. Se o failsafe do reveal falhar,
  // a miniatura fica branca — bug que já aconteceu e ninguém vê pelo HTML.
  function iframesEmBranco(add) {
    Array.prototype.forEach.call(document.querySelectorAll('iframe'), function (f) {
      var d;
      try { d = f.contentDocument; } catch (e) { return; }
      // body vazio = o ambiente não carregou o iframe (preview local não carrega
      // file:// aninhado). Não dá pra concluir nada; conferir na página publicada.
      if (!d || !d.body || d.body.children.length === 0) return;
      var visivel = 0;
      Array.prototype.forEach.call(d.body.querySelectorAll('*'), function (el) {
        var r = el.getBoundingClientRect();
        if (r.height > 30 && parseFloat(d.defaultView.getComputedStyle(el).opacity) > 0.05) visivel++;
      });
      if (visivel < 5) {
        add('alto', 'iframe', 'Miniatura praticamente em branco (' + visivel + ' blocos visíveis): ' + (f.src || '').slice(-40), f);
      }
    });
  }

  function layout(add) {
    var de = document.documentElement;
    // Painel de preview às vezes reporta largura 0 — aí a medida não vale nada.
    if (de.clientWidth < 200) {
      add('info', 'overflow', 'Largura da viewport = ' + de.clientWidth + 'px; checagem de overflow pulada', null);
      return;
    }
    if (de.scrollWidth > de.clientWidth + 2) {
      add('alto', 'overflow', 'Página rola na horizontal: ' + de.scrollWidth + 'px > ' + de.clientWidth + 'px', document.body);
      Array.prototype.forEach.call(document.querySelectorAll('body *'), function (el) {
        var r = el.getBoundingClientRect();
        if (r.right > de.clientWidth + 2 && r.width > 30 && getComputedStyle(el).position !== 'fixed') {
          add('info', 'overflow', 'Vaza ' + Math.round(r.right - de.clientWidth) + 'px: "' + texto(el) + '"', el);
        }
      });
    }
    // Texto cortado por ancestral com overflow:hidden: não gera rolagem, então a checagem
    // acima passa batido. Bug real (psicologo-1 e derivados): a figura do hero esticava a
    // coluna do grid além da tela e o overflow:hidden da section decepava o h1 no celular.
    Array.prototype.forEach.call(document.querySelectorAll('h1,h2,h3,p,li,dd,dt,summary'), function (el) {
      var r = el.getBoundingClientRect();
      if (r.width < 60 || r.height === 0) return;
      if (getComputedStyle(el).position === 'fixed') return;
      var temTextoProprio = Array.prototype.some.call(el.childNodes, function (n) {
        return n.nodeType === 3 && n.textContent.trim();
      });
      if (!temTextoProprio) return;
      var sai = Math.max(r.right - de.clientWidth, -r.left);
      if (sai > 2) add('alto', 'cortado', 'Texto sai ' + Math.round(sai) + 'px da tela: "' + texto(el) + '"', el);
    });
  }

  function toque(add) {
    Array.prototype.forEach.call(document.querySelectorAll('a,button,[role=button],input,select'), function (el) {
      if (!el.offsetParent) return;
      var r = el.getBoundingClientRect();
      if (r.height > 0 && r.height < 32 && r.width < 120) {
        add('baixo', 'a11y', 'Alvo de toque ' + Math.round(r.width) + 'x' + Math.round(r.height) + 'px (mínimo 44px): "' + texto(el) + '"', el);
      }
    });
  }

  function meta(out, add) {
    out.meta.titulo = document.title;
    out.meta.lang = document.documentElement.lang;
    out.meta.viewport = !!document.querySelector('meta[name=viewport]');
    out.meta.favicon = !!document.querySelector('link[rel~=icon]');
    out.meta.rodapeDemo = /Modelo demonstrativo/i.test(document.body.textContent);
    out.meta.chipPortfolio = !!document.querySelector('a[href*="portifolio.raynathus"]');
    if (out.meta.lang !== 'pt-BR') add('medio', 'meta', 'lang="' + out.meta.lang + '" (esperado pt-BR)', document.documentElement);
    if (!out.meta.viewport) add('alto', 'meta', 'Falta <meta name=viewport>', document.head);
    if (!out.meta.favicon) add('baixo', 'meta', 'Sem favicon', document.head);
    Array.prototype.forEach.call(document.querySelectorAll('img'), function (i) {
      if (!i.hasAttribute('alt')) add('medio', 'a11y', 'Imagem sem alt: ' + (i.src || '').slice(-50), i);
      if (i.complete && i.naturalWidth === 0) add('alto', 'imagem', 'Imagem não carregou: ' + (i.src || '').slice(-60), i);
    });
  }

  // Texto visível + dados repetidos — insumo pra revisão de copy.
  function copy(out) {
    // innerText, não textContent: respeita o layout e separa blocos com quebra de
    // linha. Com textContent, "99999-9999" colado em "pedidos@..." virava um e-mail
    // inexistente no relatório.
    out.texto = (document.body.innerText || '').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
    var t = out.texto;
    out.dados = {
      telefones: [...new Set(t.match(/\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}/g) || [])],
      emails: [...new Set(t.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || [])],
      precos: [...new Set(t.match(/R\$\s?[\d.,]+/g) || [])],
      cnpjCpf: [...new Set(t.match(/\d{2,3}[.\s]?\d{3}[.\s]?\d{3}/g) || [])]
    };
  }

  window.__auditar = function () {
    var out = { url: location.href, largura: window.innerWidth, achados: [], meta: {}, texto: '', dados: {} };
    var add = function (sev, cat, msg, el) {
      out.achados.push({ sev: sev, cat: cat, msg: msg, alvo: el ? seletor(el) : null });
    };
    copy(out);           // texto ANTES de mexer em qualquer coisa
    meta(out, add);
    falsaAffordance(add);
    cursorMentiroso(add);
    ancoras(add);
    linksExternos(add);
    contraste(add);
    ctaNav(add);
    revealPreso(add);
    iframesEmBranco(add);
    layout(add);
    toque(add);
    campos(add);
    botaoMorto(add);     // por último: clica em coisas, muda a página
    var ordem = { alto: 0, medio: 1, baixo: 2, info: 3 };
    out.achados.sort(function (a, b) { return ordem[a.sev] - ordem[b.sev]; });
    out.resumo = ['alto', 'medio', 'baixo', 'info'].reduce(function (acc, s) {
      acc[s] = out.achados.filter(function (a) { return a.sev === s; }).length;
      return acc;
    }, {});
    return out;
  };
  return 'auditoria pronta — chame __auditar()';
})();
