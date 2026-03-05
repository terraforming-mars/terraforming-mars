#!/usr/bin/env node
// gen_card_data.js — парсит карты из исходников TM в structured JSON.
// Выход: card_data.js (module.exports = { ... })
//
// Извлекает: name, type, cost, tags, requirements, victoryPoints,
//   behavior (production, stock, global, city, greenery, ocean, colony, tradeFleet),
//   action, cardDiscount, resourceType, expansion, cardNumber

const fs = require('fs');
const path = require('path');

const CARDS_DIR = path.join(__dirname, 'src/server/cards');
const OUT_FILE = path.join(__dirname, 'card_data.js');

// Expansion from directory name
const EXPANSION_MAP = {
  base: 'base', venusNext: 'venus', colonies: 'colonies',
  turmoil: 'turmoil', prelude: 'prelude', prelude2: 'prelude2',
  promo: 'promo', ares: 'ares', moon: 'moon',
  pathfinders: 'pathfinders', community: 'community',
  corporation: 'corporation', ceos: 'ceos',
  underworld: 'underworld', starwars: 'starwars',
};

// Load enum maps from source
function loadEnumMap(filePath) {
  try {
    const src = fs.readFileSync(filePath, 'utf8');
    const map = {};
    for (const m of src.matchAll(/(\w+)\s*=\s*'([^']+)'/g)) {
      map[m[1]] = m[2];
    }
    return map;
  } catch { return {}; }
}

const cardNameMap = loadEnumMap(path.join(__dirname, 'src/common/cards/CardName.ts'));
const tagMap = loadEnumMap(path.join(__dirname, 'src/common/cards/Tag.ts'));
const resourceMap = loadEnumMap(path.join(__dirname, 'src/common/Resource.ts'));
const cardResourceMap = loadEnumMap(path.join(__dirname, 'src/common/CardResource.ts'));

function resolveTag(s) {
  return tagMap[s.trim().replace(/^Tag\./, '')] || s.toLowerCase().replace(/^tag\./, '');
}
function resolveCardName(s) {
  return cardNameMap[s.trim().replace(/^CardName\./, '')] || s;
}
function resolveResource(s) {
  return resourceMap[s.trim().replace(/^Resource\./, '')] || s.toLowerCase();
}
function resolveCardResource(s) {
  return cardResourceMap[s.trim().replace(/^CardResource\./, '')] || s.toLowerCase();
}

// Extract balanced brace block starting at position
function extractBraced(block, start, open, close) {
  let depth = 0;
  for (let i = start; i < block.length; i++) {
    if (block[i] === open) depth++;
    else if (block[i] === close) {
      depth--;
      if (depth === 0) return block.slice(start, i + 1);
    }
  }
  return block.slice(start);
}

// Extract the super({...}) block from TS source
function extractSuperBlock(src) {
  const idx = src.indexOf('super({');
  if (idx < 0) return null;
  const start = idx + 6;
  return extractBraced(src, start, '{', '}');
}

// Extract a field value from a block (handles nested objects/arrays)
function extractField(block, key) {
  const re = new RegExp(`(?:^|[,{\\n])\\s*${key}\\s*:\\s*`, 'gm');
  const m = re.exec(block);
  if (!m) return null;
  let i = m.index + m[0].length;
  while (i < block.length && /\s/.test(block[i])) i++;

  const ch = block[i];
  if (ch === '{') return extractBraced(block, i, '{', '}');
  if (ch === '[') return extractBraced(block, i, '[', ']');
  if (ch === "'" || ch === '"') {
    const end = block.indexOf(ch, i + 1);
    return block.slice(i + 1, end);
  }
  // Number, boolean, or enum reference
  let end = i;
  while (end < block.length && !/[,}\]\n]/.test(block[end])) end++;
  return block.slice(i, end).trim();
}

// Parse [Tag.ANIMAL, Tag.SPACE] → ['animal', 'space']
function parseTags(raw) {
  if (!raw) return [];
  const matches = raw.match(/Tag\.\w+|'[^']+'/g) || [];
  return matches.map(s => resolveTag(s.replace(/'/g, '')));
}

// Parse requirements object
function parseRequirements(raw) {
  if (!raw) return null;
  const reqs = {};
  for (const m of raw.matchAll(/(\w+)\s*:\s*(-?\d+)/g)) {
    reqs[m[1]] = parseInt(m[2]);
  }
  for (const m of raw.matchAll(/tag\s*:\s*Tag\.(\w+)/g)) {
    reqs['tag'] = resolveTag(m[1]);
  }
  return Object.keys(reqs).length > 0 ? reqs : null;
}

// Parse production/stock object: {energy: -1, megacredits: 4}
function parseResourceObj(raw) {
  if (!raw) return null;
  const obj = {};
  for (const m of raw.matchAll(/(\w+)\s*:\s*(-?\d+)/g)) {
    obj[m[1]] = parseInt(m[2]);
  }
  return Object.keys(obj).length > 0 ? obj : null;
}

// Parse behavior block
function parseBehavior(raw) {
  if (!raw) return null;
  const b = {};

  const prod = parseResourceObj(extractField(raw, 'production'));
  if (prod) b.production = prod;

  const stock = parseResourceObj(extractField(raw, 'stock'));
  if (stock) b.stock = stock;

  const glob = parseResourceObj(extractField(raw, 'global'));
  if (glob) b.global = glob;

  const trMatch = raw.match(/\btr\s*:\s*(\d+)/);
  if (trMatch) b.tr = parseInt(trMatch[1]);

  if (/\bcity\b\s*:/.test(raw) || raw.includes('TileType.')) b.city = true;
  if (/\bgreenery\b/.test(raw) && !/greeneryCount/.test(raw)) b.greenery = true;
  if (/\bocean\b/.test(raw)) b.ocean = true;
  if (/buildColony/.test(raw)) b.colony = true;
  if (/addTradeFleet/.test(raw)) b.tradeFleet = true;

  const rmPl = raw.match(/removeAnyPlants\s*:\s*(\d+)/);
  if (rmPl) b.removeAnyPlants = parseInt(rmPl[1]);

  const dap = extractField(raw, 'decreaseAnyProduction');
  if (dap) {
    const typeM = dap.match(/Resource\.(\w+)/);
    const countM = dap.match(/count\s*:\s*(\d+)/);
    if (typeM) {
      b.decreaseAnyProduction = {
        type: resolveResource(typeM[0]),
        count: countM ? parseInt(countM[1]) : 1,
      };
    }
  }

  const draw = raw.match(/drawCard\s*:\s*(\d+)/);
  if (draw) b.drawCard = parseInt(draw[1]);

  const addRes = raw.match(/addResources\s*:\s*(\d+)/);
  if (addRes) b.addResources = parseInt(addRes[1]);

  return Object.keys(b).length > 0 ? b : null;
}

// Parse action block
function parseAction(raw) {
  if (!raw) return null;
  const a = {};

  const addRes = raw.match(/addResources\s*:\s*(\d+)/);
  if (addRes) a.addResources = parseInt(addRes[1]);

  const spend = raw.match(/spend\s*:\s*(\d+)/);
  if (spend) a.spend = parseInt(spend[1]);

  const draw = raw.match(/drawCard\s*:\s*(\d+)/);
  if (draw) a.drawCard = parseInt(draw[1]);

  const prod = parseResourceObj(extractField(raw, 'production'));
  if (prod) a.production = prod;

  const stock = parseResourceObj(extractField(raw, 'stock'));
  if (stock) a.stock = stock;

  const glob = parseResourceObj(extractField(raw, 'global'));
  if (glob) a.global = glob;

  if (raw.includes('temperature')) a.temperature = true;
  if (raw.includes('ocean') && !raw.includes('oceans')) a.ocean = true;
  if (/\btr\s*:\s*(\d+)/.test(raw)) a.tr = parseInt(raw.match(/\btr\s*:\s*(\d+)/)[1]);

  return Object.keys(a).length > 0 ? a : null;
}

// Parse victoryPoints
function parseVP(raw) {
  if (!raw) return null;
  const num = parseInt(raw);
  if (!isNaN(num)) return { type: 'static', vp: num };
  if (raw.includes("'special'") || raw === 'special') return { type: 'special' };
  if (raw.includes('resourcesHere')) {
    const per = raw.match(/per\s*:\s*(\d+)/);
    return { type: 'per_resource', per: per ? parseInt(per[1]) : 1 };
  }
  const tagMatch = raw.match(/tag\s*:\s*Tag\.(\w+)/);
  if (tagMatch) {
    const per = raw.match(/per\s*:\s*(\d+)/);
    return { type: 'per_tag', tag: resolveTag(tagMatch[1]), per: per ? parseInt(per[1]) : 1 };
  }
  if (raw.includes('colonies')) {
    const per = raw.match(/per\s*:\s*(\d+)/);
    return { type: 'per_colony', per: per ? parseInt(per[1]) : 1 };
  }
  if (raw.includes('cities') || raw.includes('city')) {
    const per = raw.match(/per\s*:\s*(\d+)/);
    return { type: 'per_city', per: per ? parseInt(per[1]) : 1 };
  }
  return { type: 'special' };
}

// Parse cardDiscount
function parseDiscount(raw) {
  if (!raw) return null;
  const amount = raw.match(/amount\s*:\s*(\d+)/);
  if (!amount) return null;
  const d = { amount: parseInt(amount[1]) };
  const tagMatch = raw.match(/tag\s*:\s*Tag\.(\w+)/);
  if (tagMatch) d.tag = resolveTag(tagMatch[1]);
  const perMatch = raw.match(/per\s*:\s*'(\w+)'/);
  if (perMatch) d.per = perMatch[1];
  return d;
}

// Process one .ts card file
function processFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const block = extractSuperBlock(src);
  if (!block) return null;

  // Expansion from path
  const parts = filePath.replace(/\\/g, '/').split('/');
  const cardsIdx = parts.indexOf('cards');
  const expansion = cardsIdx >= 0 ? (EXPANSION_MAP[parts[cardsIdx + 1]] || parts[cardsIdx + 1]) : 'unknown';

  const card = {};

  // Name
  const nameRaw = extractField(block, 'name');
  if (nameRaw) card.name = resolveCardName(nameRaw);
  if (!card.name || card.name.includes(':SP') || card.name === 'Convert Plants' || card.name === 'Convert Heat') return null;

  // Type
  const typeRaw = extractField(block, 'type');
  if (typeRaw) card.type = typeRaw.replace('CardType.', '').toLowerCase();

  // Cost
  const costRaw = extractField(block, 'cost');
  if (costRaw) { const c = parseInt(costRaw); if (!isNaN(c)) card.cost = c; }

  // Tags
  const tagsRaw = extractField(block, 'tags');
  if (tagsRaw) card.tags = parseTags(tagsRaw);

  // Requirements
  const reqs = parseRequirements(extractField(block, 'requirements'));
  if (reqs) card.requirements = reqs;

  // VP
  const vp = parseVP(extractField(block, 'victoryPoints'));
  if (vp) card.vp = vp;

  // Behavior
  const behavior = parseBehavior(extractField(block, 'behavior'));
  if (behavior) card.behavior = behavior;

  // Action
  const action = parseAction(extractField(block, 'action'));
  if (action) card.action = action;

  // Card discount
  const discount = parseDiscount(extractField(block, 'cardDiscount'));
  if (discount) card.cardDiscount = discount;

  // Resource type
  const resTypeRaw = extractField(block, 'resourceType');
  if (resTypeRaw) card.resourceType = resolveCardResource(resTypeRaw);

  // Card number
  const numMatch = src.match(/cardNumber\s*:\s*'([^']+)'/);
  if (numMatch) card.cardNumber = numMatch[1];

  // Description (first string after 'description')
  const descMatch = src.match(/description\s*:\s*(?:{[^}]*text\s*:\s*)?'([^']{10,})'/);
  if (descMatch) card.description = descMatch[1];
  if (!card.description) {
    const desc2 = src.match(/description\s*:\s*'([^']{10,})'/);
    if (desc2) card.description = desc2[1];
  }

  card.expansion = expansion;
  return card;
}

// Recursive directory walk
function walkDir(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['render', 'requirements', '__tests__'].includes(entry.name)) {
      files.push(...walkDir(full));
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      files.push(full);
    }
  }
  return files;
}

// ====== MAIN ======
const files = walkDir(CARDS_DIR);
const cards = {};
let parsed = 0, skipped = 0;

for (const f of files) {
  try {
    const card = processFile(f);
    if (card && card.name) {
      cards[card.name] = card;
      parsed++;
    } else {
      skipped++;
    }
  } catch (e) {
    skipped++;
  }
}

// Write output
const header = `// Auto-generated card data — ${parsed} cards from TM source\n// Generated: ${new Date().toISOString()}\nconst CARD_DATA = `;
const footer = `;\nif (typeof module !== 'undefined') module.exports = CARD_DATA;\n`;
fs.writeFileSync(OUT_FILE, header + JSON.stringify(cards, null, 2) + footer);

console.log(`Done: ${parsed} cards parsed, ${skipped} files skipped`);
console.log(`Output: ${OUT_FILE}`);

// Stats
const types = {}, expansions = {};
let hasProduction = 0, hasAction = 0, hasVP = 0, hasDiscount = 0;
for (const c of Object.values(cards)) {
  types[c.type] = (types[c.type] || 0) + 1;
  expansions[c.expansion] = (expansions[c.expansion] || 0) + 1;
  if (c.behavior?.production) hasProduction++;
  if (c.action) hasAction++;
  if (c.vp) hasVP++;
  if (c.cardDiscount) hasDiscount++;
}
console.log('\nBy type:', types);
console.log('By expansion:', expansions);
console.log(`\nWith production: ${hasProduction}, With action: ${hasAction}, With VP: ${hasVP}, With discount: ${hasDiscount}`);

// Sample cards
const samples = ['Birds', 'Earth Catapult', 'Open City', 'Asteroid', 'Capital', 'Space Port Colony', 'Solar Logistics', 'Crash Site Cleanup', 'Ice Moon Colony'];
for (const name of samples) {
  if (cards[name]) console.log(`\n${name}:`, JSON.stringify(cards[name], null, 2));
}
