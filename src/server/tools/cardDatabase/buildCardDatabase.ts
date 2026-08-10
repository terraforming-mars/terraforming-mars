import {ALL_MODULE_MANIFESTS} from '@/server/cards/AllManifests';
import {CardEntry, CardKind, CardSet, IndexEntry} from './CardDatabaseTypes';
import {CardManifest, ModuleManifest} from '@/server/cards/ModuleManifest';
import {Expansion, GameModule} from '@/common/cards/GameModule';
import {normalizeEffect, normalizeVictoryPoints} from './normalizeEffect';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {ICard} from '@/server/cards/ICard';
import {OneOrArray} from '@/common/utils/types';
import {asArray} from '@/common/utils/utils';
import {cardId} from './cardId';
import {hasBespokeLogic} from './hasBespokeLogic';
import {isIDescription} from '@/common/cards/render/ICardRenderDescription';
import {normalizeRequirements} from './normalizeRequirements';
import {applyOverlay} from './overlay';

/** The sets this database covers, in the order they are emitted. */
const SETS: ReadonlyArray<CardSet> = ['base', 'corpera', 'prelude'];

function isCardSet(module: GameModule): module is CardSet {
  return SETS.includes(module as CardSet);
}

function kindOf(type: CardType): CardKind {
  switch (type) {
  case CardType.CORPORATION:
    return 'corporation';
  case CardType.PRELUDE:
    return 'prelude';
  default:
    return 'project';
  }
}

function describe(card: ICard): string | undefined {
  const description = card.metadata.description;
  if (description === undefined) {
    return undefined;
  }
  return isIDescription(description) ? description.text : description;
}

function entryFor(set: CardSet, card: Card, compatibility: undefined | OneOrArray<Expansion>): CardEntry {
  const kind = kindOf(card.type);
  const entry: CardEntry = {
    id: cardId(card.name),
    name: card.name,
    set: set,
    kind: kind,
    type: card.type,
    tags: [...card.tags],
    bespoke: hasBespokeLogic(card),
  };

  if (card.metadata.cardNumber !== undefined) {
    entry.card_number = card.metadata.cardNumber;
  }
  const description = describe(card);
  if (description !== undefined) {
    entry.description = description;
  }
  if (kind !== 'corporation') {
    entry.cost = card.cost;
  }
  if (kind !== 'project') {
    entry.starting_megacredits = card.startingMegaCredits;
  }
  if (card.cardCost !== undefined) {
    entry.card_cost = card.cardCost;
  }
  if (card.resourceType !== undefined) {
    entry.resource_type = card.resourceType;
  }
  if (card.protectedResources === true) {
    entry.protected_resources = true;
  }

  const vp = card.victoryPoints;
  if (typeof vp === 'number') {
    entry.vp = vp;
  } else if (vp === 'special') {
    entry.vp_special = true;
  } else if (vp !== undefined) {
    entry.vp_dynamic = normalizeVictoryPoints(vp);
  }

  if (card.requirements.length > 0) {
    entry.requirements = normalizeRequirements(card.requirements);
  }

  const immediate = normalizeEffect(card.behavior);
  if (immediate !== undefined) {
    entry.immediate = immediate;
  }
  const firstAction = normalizeEffect(card.firstAction);
  const firstActionText = card.initialActionText;
  if (firstAction !== undefined || firstActionText !== undefined) {
    entry.first_action = {...firstAction};
    if (firstActionText !== undefined) {
      entry.first_action.text = firstActionText;
    }
  }
  const action = normalizeEffect(card.actionBehavior);
  if (action !== undefined) {
    entry.action = action;
  }

  if (card.cardDiscount !== undefined) {
    entry.card_discount = asArray(card.cardDiscount).map((discount) => ({...discount}));
  }
  const bonus = card.globalParameterRequirementBonus;
  if (bonus !== undefined) {
    entry.global_parameter_requirement_bonus = {steps: bonus.steps};
    if (bonus.parameter !== undefined) {
      entry.global_parameter_requirement_bonus.parameter = bonus.parameter;
    }
    if (bonus.nextCardOnly === true) {
      entry.global_parameter_requirement_bonus.next_card_only = true;
    }
  }
  if (compatibility !== undefined) {
    entry.compatibility = [...asArray(compatibility)];
  }
  return entry;
}

function entriesFromDeck<T extends ICard>(deck: CardManifest<T>, set: CardSet, entries: Array<CardEntry>): void {
  for (const factory of CardManifest.values(deck)) {
    const card = new factory.Factory();
    if (card.type === CardType.PROXY) {
      continue;
    }
    if (!(card instanceof Card)) {
      throw new Error('Not a data-driven card: ' + card.name);
    }
    entries.push(applyOverlay(entryFor(set, card, factory.compatibility)));
  }
}

function entriesForManifest(manifest: ModuleManifest, set: CardSet): Array<CardEntry> {
  const entries: Array<CardEntry> = [];
  entriesFromDeck(manifest.projectCards, set, entries);
  entriesFromDeck(manifest.corporationCards, set, entries);
  entriesFromDeck(manifest.preludeCards, set, entries);
  return entries;
}

/**
 * Builds the card database for the base, Corporate Era and Prelude modules.
 *
 * Entries are sorted by set and then by id so that repeated runs produce
 * identical output.
 */
export function buildCardDatabase(): Array<CardEntry> {
  const entries: Array<CardEntry> = [];
  for (const manifest of ALL_MODULE_MANIFESTS) {
    if (isCardSet(manifest.module)) {
      entries.push(...entriesForManifest(manifest, manifest.module));
    }
  }
  return entries.sort((a, b) => {
    const bySet = SETS.indexOf(a.set) - SETS.indexOf(b.set);
    return bySet !== 0 ? bySet : a.id.localeCompare(b.id);
  });
}

/** Reduces the database to the fields an agent needs to find a card. */
export function buildIndex(entries: ReadonlyArray<CardEntry>): Array<IndexEntry> {
  return entries.map((entry) => {
    const row: IndexEntry = {
      id: entry.id,
      name: entry.name,
      set: entry.set,
      kind: entry.kind,
      type: entry.type,
      tags: entry.tags,
      bespoke: entry.bespoke,
    };
    if (entry.cost !== undefined) {
      row.cost = entry.cost;
    }
    if (entry.vp !== undefined) {
      row.vp = entry.vp;
    }
    return row;
  });
}
