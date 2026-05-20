import fs from 'fs';
import path from 'path';

import {CardName} from '../common/cards/CardName';
import {milestoneNames} from '../common/ma/MilestoneName';
import {awardNames} from '../common/ma/AwardName';

const LESS_PATH = path.resolve('src/styles/language_hacks.less');

// Mirrors Card.vue cardClasses(): 'card-' + name.toLowerCase().replaceAll(' ', '-')
function cardSlug(name: string): string {
  return name.toLowerCase().replaceAll(' ', '-');
}

// Mirrors CardCorporationLogo.vue logoClass(): 'card-' + (slugified) + '-logo'
function logoSlug(name: string): string {
  return name.toLowerCase().replaceAll(' ', '-').replaceAll('&', '').replaceAll('--', '-');
}

// Mirrors Milestone.vue / Award.vue nameCss().
function maSlug(name: string): string {
  return name.replaceAll(' ', '-').replaceAll('.', '').toLowerCase();
}

const cardNames = Object.values(CardName);
const validCardSlugs = new Set(cardNames.map(cardSlug));
const validLogoSlugs = new Set(cardNames.map(logoSlug));
const validMaSlugs = new Set([...milestoneNames, ...awardNames].map(maSlug));

// `.card-<x>` suffixes that are layout/structural classes, not card-instance
// references. Add to this list when a new internal class is introduced.
const INTERNAL_CARD_SUFFIXES: ReadonlySet<string> = new Set<string>([
  'container',
  'content',
  'content-corporation',
  'content-plants',
  'content-wrapper',
  'corporation-box',
  'corporation-logo',
  'corruption-shield',
  'description',
  'description-aligned',
  'description-align--left',
  'effect-box',
  'effect-box-content',
  'effect-box-row',
  'influence',
  'item-container',
  'logistics-rate',
  'or',
  'or--small',
  'plate',
  'production-box',
  'red-arrow',
  'red-arrow--small',
  'requirements',
  'res-amount',
  'resource',
  'resource-money',
  'resource-tag',
  'resource-trade-fleet',
  'row',
  'rows',
  'special',
  'tag-space',
  'text-normal',
  'text-size--M',
  'text-size--S',
  'text-size--XS',
  'tile',
  'tile-lunar-habitat-rate',
  'tile-lunar-mine-rate',
  'title',
  'tr--XS',
  'venus-global-requirement',
  'vspace--large',
  'x',
]);

// `.<name>` where <name> is class-name chars or `\X` escapes (e.g. `\(`, `\:`).
const SELECTOR_RE = /\.((?:[a-zA-Z0-9_-]|\\.)+)/g;

function unescape(s: string): string {
  return s.replace(/\\(.)/g, '$1');
}

function isValidCardSuffix(suffix: string): boolean {
  if (validCardSlugs.has(suffix)) {
    return true;
  }
  if (INTERNAL_CARD_SUFFIXES.has(suffix)) {
    return true;
  }
  // Corporate logo: `<corp-slug>-logo`.
  if (suffix.endsWith('-logo')) {
    const corp = suffix.slice(0, -'-logo'.length);
    if (validLogoSlugs.has(corp)) {
      return true;
    }
  }
  return false;
}

type Finding = {line: number; selector: string; kind: 'card' | 'ma'};

function audit(): Finding[] {
  const text = fs.readFileSync(LESS_PATH, 'utf8');
  const lines = text.split('\n');
  const findings: Finding[] = [];

  for (let i = 0; i < lines.length; i++) {
    const code = lines[i].replace(/\/\/.*$/, '');
    for (const match of code.matchAll(SELECTOR_RE)) {
      const raw = unescape(match[1]);
      if (raw.startsWith('ma-name--')) {
        const slug = raw.slice('ma-name--'.length);
        if (!validMaSlugs.has(slug)) {
          findings.push({line: i + 1, selector: '.' + raw, kind: 'ma'});
        }
      } else if (raw.startsWith('card-')) {
        const suffix = raw.slice('card-'.length);
        if (!isValidCardSuffix(suffix)) {
          findings.push({line: i + 1, selector: '.' + raw, kind: 'card'});
        }
      }
    }
  }

  return findings;
}

const findings = audit();
for (const f of findings) {
  const what = f.kind === 'card' ? 'CardName' : 'milestone/award name';
  console.log(`language_hacks.less:${f.line}: unknown selector "${f.selector}" (no matching ${what})`);
}

if (findings.length > 0) {
  console.error(`\n${findings.length} stale selector(s) in language_hacks.less. Stopping.`);
  process.exit(1);
}
