import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {SerializedColonyDealer} from './SerializedColonyDealer';
import {Random} from '../Random';
import {ALL_COLONIES_TILES, COMMUNITY_COLONIES_TILES} from './ColonyManifest';
import {ColonyDeserializer} from './ColonyDeserializer';

// TODO(kberg): Add ability to hard-code chosen colonies, separate from customColoniesList, so as to not be
// forced to rely on randomness.
// TODO(kberg): Add ability to disable initial action that removes a colony in the solo game. (Or come up with
// a simple line of code to deal with solo games.)

export class ColonyDealer {
  public discardedColonies: Array<Colony> = [];

  constructor(private rng: Random) {}

  private shuffle(cards: Array<Colony>): Array<Colony> {
    const deck: Array<Colony> = [];
    const copy = cards.slice();
    while (copy.length) {
      deck.push(copy.splice(Math.floor(this.rng.nextInt(copy.length)), 1)[0]);
    }
    return deck;
  }
  public drawColonies(players: number, allowList: Array<ColonyName> = [], venusNextExtension: boolean, turmoilExtension: boolean, addCommunityColonies: boolean = false): Array<Colony> {
    let colonyTiles = ALL_COLONIES_TILES;
    if (addCommunityColonies) colonyTiles = colonyTiles.concat(COMMUNITY_COLONIES_TILES);
    if (!venusNextExtension) colonyTiles = colonyTiles.filter((c) => c.colonyName !== ColonyName.VENUS);
    if (!turmoilExtension) colonyTiles = colonyTiles.filter((c) => c.colonyName !== ColonyName.PALLAS);

    if (allowList.length === 0) {
      colonyTiles.forEach((e) => allowList.push(e.colonyName));
    }

    // Two-player games and solo games get one more colony.
    const count: number = (players + 2) + (players <= 2 ? 1 : 0);

    const tempDeck = this.shuffle(
      colonyTiles.filter(
        (el) => allowList.includes(el.colonyName),
      ).map(
        (cf) => new cf.Factory(),
      ),
    );
    const deck: Array<Colony> = [];
    for (let i = 0; i < count; i++) {
      deck.push(tempDeck.pop()!);
    }

    this.discardedColonies.push(...tempDeck);
    this.discardedColonies.sort((a, b) => (a.name > b.name) ? 1 : -1);
    deck.sort((a, b) => (a.name > b.name) ? 1 : -1);
    return deck;
  }

  public serialize(): SerializedColonyDealer {
    return {
      discardedColonies: this.discardedColonies.map((c) => c.name),
    };
  }

  public static deserialize(d: SerializedColonyDealer | undefined, rng: Random): ColonyDealer {
    const colonyDealer = new ColonyDealer(rng);
    if (d !== undefined) {
      colonyDealer.discardedColonies = ColonyDeserializer.deserializeAndFilter(d.discardedColonies);
    }
    return colonyDealer;
  }
}
