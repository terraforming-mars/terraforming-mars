import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {IGlobalEvent} from './IGlobalEvent';
import {IGame} from '../../IGame';
import {LegacySerializedGlobalEventDealer} from './LegacySerializedGlobalEventDealer';
import {GlobalEventManifest, ModuleManifest} from '../../cards/ModuleManifest';
import {isCompatibleWith} from '../../cards/CardFactorySpec';
import {inplaceShuffle} from '../../utils/shuffle';
import {GameModule} from '../../../common/cards/GameModule';
import {Deck} from '@/server/cards/Deck';
import {Random} from '@/common/utils/Random';
import {SerializedDeck} from '@/server/cards/SerializedDeck';
import {Logger} from '@/server/logs/Logger';

// When renaming, add the rename here and add a TODO (like the example below)
// And remember to add a test in GlobalEventDealer.spec.ts
const RENAMED_GLOBAL_EVENTS: Array<[GlobalEventName, GlobalEventFactory]> = [
  // ['Miners Of Strike' as GlobalEventName, MinersOnStrike],
];

type GlobalEventFactory = new () => IGlobalEvent;

const ALL_EVENTS = new Map<GlobalEventName, GlobalEventFactory>();
// A local copy supplied to prevent import cycles
const ALL_MODULE_MANIFESTS: Array<ModuleManifest> = [];

// Only called once during setup. Call with ALL_MODULE_MANIFESTS
export function initializeGlobalEventDealer(allModuleManifests: Array<ModuleManifest>) {
  if (ALL_EVENTS.size > 0) {
    return;
  }
  ALL_MODULE_MANIFESTS.push(...allModuleManifests);
  for (const manifest of allModuleManifests) {
    for (const card of GlobalEventManifest.entries(manifest.globalEvents)) {
      ALL_EVENTS.set(card[0], card[1].Factory);
    }
  }
  for (const card of RENAMED_GLOBAL_EVENTS) {
    ALL_EVENTS.set(card[0], card[1]);
  }
}

export function getGlobalEventByName(globalEventName: GlobalEventName): IGlobalEvent | undefined {
  const Factory = ALL_EVENTS.get(globalEventName);

  if (Factory !== undefined) {
    return new Factory();
  }
  console.warn(`unable to find global event ${globalEventName}`);
  return undefined;
}

function globalEventsFromJSON(names: ReadonlyArray<GlobalEventName>): Array<IGlobalEvent> {
  const events: Array<IGlobalEvent> = [];
  for (const name of names) {
    const globalEvent = getGlobalEventByName(name);
    if (globalEvent !== undefined) {
      events.push(globalEvent);
    }
  }
  return events;
}

export class GlobalEventDeck extends Deck<IGlobalEvent, GlobalEventName> {
  public constructor(deck: Array<IGlobalEvent>, discarded: Array<IGlobalEvent>, random: Random) {
    super('global event', deck, discarded, random);
  }

  public static deserialize(d: SerializedDeck<GlobalEventName> | LegacySerializedGlobalEventDealer, random: Random): GlobalEventDeck {
    if ('drawPile' in d) {
      return new GlobalEventDeck(globalEventsFromJSON(d.drawPile), globalEventsFromJSON(d.discardPile), random);
    }
    return new GlobalEventDeck(globalEventsFromJSON(d.deck), globalEventsFromJSON(d.discarded), random);
  }
}

export class GlobalEventDealer {
  private constructor(public readonly deck: GlobalEventDeck) {}

  public static newInstance(game: IGame): GlobalEventDealer {
    const events: Array<IGlobalEvent> = [];

    const gameOptions = game.gameOptions;
    // TODO(kberg): Merge with GameCards.
    const includes: Record<GameModule, boolean> = {base: true, ...gameOptions.expansions};

    for (const manifest of ALL_MODULE_MANIFESTS) {
      if (includes[manifest.module] !== true) {
        continue;
      }
      for (const card of GlobalEventManifest.entries(manifest.globalEvents)) {
        const factory = card[1];
        if (game.gameOptions.removeNegativeGlobalEventsOption && factory.negative === true) {
          continue;
        }
        if (isCompatibleWith(factory, game.gameOptions)) {
          events.push(new factory.Factory());
        }
      }
    }
    inplaceShuffle(events, game.rng);
    return new GlobalEventDealer(new GlobalEventDeck(events, [], game.rng));
  }

  public draw(logger: Logger): IGlobalEvent | undefined {
    return this.deck.draw(logger);
  }

  public discard(globalEvent: IGlobalEvent) {
    this.deck.discard(globalEvent);
  }

  public serialize(): SerializedDeck<GlobalEventName> {
    return this.deck.serialize();
  }

  public static deserialize(d: SerializedDeck<GlobalEventName> | LegacySerializedGlobalEventDealer, random: Random): GlobalEventDealer {
    return new GlobalEventDealer(GlobalEventDeck.deserialize(d, random));
  }
}
