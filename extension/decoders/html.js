const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
  copy: '\u00a9',
  reg: '\u00ae',
  trade: '\u2122',
  euro: '\u20ac',
  pound: '\u00a3',
  yen: '\u00a5',
  cent: '\u00a2',
  mdash: '\u2014',
  ndash: '\u2013',
  lsquo: '\u2018',
  rsquo: '\u2019',
  ldquo: '\u201c',
  rdquo: '\u201d',
  hellip: '\u2026',
  bull: '\u2022',
  middot: '\u00b7',
  times: '\u00d7',
  divide: '\u00f7',
  frac12: '\u00bd',
  frac14: '\u00bc',
  frac34: '\u00be',
  deg: '\u00b0',
  plusmn: '\u00b1',
  sup2: '\u00b2',
  sup3: '\u00b3',
  micro: '\u00b5',
  para: '\u00b6',
  sect: '\u00a7',
  iexcl: '\u00a1',
  iquest: '\u00bf',
  acute: '\u00b4',
  cedil: '\u00b8',
  uml: '\u00a8',
  macr: '\u00af',
  laquo: '\u00ab',
  raquo: '\u00bb',
  not: '\u00ac',
  shy: '\u00ad',
  ordf: '\u00aa',
  ordm: '\u00ba',
  szlig: '\u00df',
  agrave: '\u00e0',
  aacute: '\u00e1',
  acirc: '\u00e2',
  atilde: '\u00e3',
  auml: '\u00e4',
  aring: '\u00e5',
  aelig: '\u00e6',
  ccedil: '\u00e7',
  egrave: '\u00e8',
  eacute: '\u00e9',
  ecirc: '\u00ea',
  euml: '\u00eb',
  igrave: '\u00ec',
  iacute: '\u00ed',
  icirc: '\u00ee',
  iuml: '\u00ef',
  eth: '\u00f0',
  ntilde: '\u00f1',
  ograve: '\u00f2',
  oacute: '\u00f3',
  ocirc: '\u00f4',
  otilde: '\u00f5',
  ouml: '\u00f6',
  oslash: '\u00f8',
  ugrave: '\u00f9',
  uacute: '\u00fa',
  ucirc: '\u00fb',
  uuml: '\u00fc',
  yacute: '\u00fd',
  thorn: '\u00fe',
  yuml: '\u00ff',
  Agrave: '\u00c0',
  Aacute: '\u00c1',
  Acirc: '\u00c2',
  Atilde: '\u00c3',
  Auml: '\u00c4',
  Aring: '\u00c5',
  AElig: '\u00c6',
  Ccedil: '\u00c7',
  Egrave: '\u00c8',
  Eacute: '\u00c9',
  Ecirc: '\u00ca',
  Euml: '\u00cb',
  Igrave: '\u00cc',
  Iacute: '\u00cd',
  Icirc: '\u00ce',
  Iuml: '\u00cf',
  ETH: '\u00d0',
  Ntilde: '\u00d1',
  Ograve: '\u00d2',
  Oacute: '\u00d3',
  Ocirc: '\u00d4',
  Otilde: '\u00d5',
  Ouml: '\u00d6',
  Oslash: '\u00d8',
  Ugrave: '\u00d9',
  Uacute: '\u00da',
  Ucirc: '\u00db',
  Uuml: '\u00dc',
  Yacute: '\u00dd',
  THORN: '\u00de',
};

function decodeHtmlFallback(input) {
  return input.replace(/&([^;]+);/g, (match, entity) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      const code = parseInt(entity.slice(2), 16);
      return isNaN(code) ? match : String.fromCodePoint(code);
    }
    if (entity.startsWith('#')) {
      const code = parseInt(entity.slice(1), 10);
      return isNaN(code) ? match : String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[entity] !== undefined ? NAMED_ENTITIES[entity] : match;
  });
}

const decoder = {
  id: 'html',
  label: 'HTML',
  accepts: 'string',
  decode(input) {
    if (typeof document !== 'undefined') {
      const t = document.createElement('textarea');
      t.innerHTML = input;
      return { text: t.value };
    }
    return { text: decodeHtmlFallback(input) };
  },
};

module.exports = decoder;
