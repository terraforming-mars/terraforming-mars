import {IColony} from './IColony';
import {ColonyName} from '../common/colonies/ColonyName';
import {SerializedColony} from '../SerializedColony';
import {Random} from '../Random';
import {ALL_COLONIES_TILES, BASE_COLONIES_TILES, COMMUNITY_COLONIES_TILES} from './ColonyManifest';

// TODO(kberg): Add ability to hard-code chosen colonies, separate from customColoniesList, so as to not be
// forced to rely on randomness.
// TODO(kberg): Add ability to disable initial action that removes a colony in the solo game. (Or come up with
// a simple line of code to deal with solo games.)
// Function to return a card object by its name
export function getColonyByName(colonyName: string): IColony | undefined {
  const colonyFactory = ALL_COLONIES_TILES.find((colonyFactory) => colonyFactory.colonyName === colonyName);
  if (colonyFactory !== undefined) {
    return new colonyFactory.Factory();
  }
  return undefined;
}

export function loadColoniesFromJSON(colonies: Array<SerializedColony>): Array<IColony> {
  const result: Array<IColony> = [];
  for (const serialized of colonies) {
    const colony = getColonyByName(serialized.name);
    if (colony !== undefined) {
      colony.colonies = serialized.colonies;
      colony.isActive = serialized.isActive;
      colony.trackPosition = serialized.trackPosition;
      colony.visitor = serialized.visitor;
      result.push(colony);
    } else {
      console.warn(`colony ${serialized.name} not found`);
    }
  }
  return result;
}

export class ColonyDealer {
  public discardedColonies: Array<IColony> = [];

  constructor(private rng: Random) {}

  private shuffle(cards: Array<IColony>): Array<IColony> {
    const deck: Array<IColony> = [];
    const copy = cards.slice();
    while (copy.length) {
      deck.push(copy.splice(Math.floor(this.rng.nextInt(copy.length)), 1)[0]);
    }
    return deck;
  }
  public drawColonies(players: number, allowList: Array<ColonyName> = [], venusNextExtension: boolean, turmoilExtension: boolean, addCommunityColonies: boolean = false): Array<IColony> {
    let colonyTiles = BASE_COLONIES_TILES;
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
    const deck = [];
    for (let i = 0; i < count; i++) {
      deck.push(tempDeck.pop()!);
    }
    this.discardedColonies.push(...tempDeck);
    this.discardedColonies.sort((a, b) => (a.name > b.name) ? 1 : -1);
    deck.sort((a, b) => (a.name > b.name) ? 1 : -1);

    return deck;
  }
}
