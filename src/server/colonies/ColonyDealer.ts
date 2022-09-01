import {IColony} from './IColony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {Random} from '../Random';
import {BASE_COLONIES_TILES, COMMUNITY_COLONIES_TILES} from './ColonyManifest';
import {GameOptions} from '../GameOptions';

// TODO(kberg): Add ability to hard-code chosen colonies, separate from customColoniesList, so as to not be
// forced to rely on the RNG.
// TODO(kberg): Add ability to disable initial action that removes a colony in the solo game. (Or come up with
// a simple line of code to deal with solo games.)

export class ColonyDealer {
  private readonly gameColonies: ReadonlyArray<IColony>;
  public colonies: Array<IColony> = [];
  public discardedColonies: Array<IColony> = [];

  constructor(private rng: Random, private gameOptions: GameOptions) {
    let colonyTiles = BASE_COLONIES_TILES;

    if (ColonyDealer.includesCommunityColonies(this.gameOptions)) colonyTiles = colonyTiles.concat(COMMUNITY_COLONIES_TILES);
    if (!this.gameOptions.venusNextExtension) colonyTiles = colonyTiles.filter((c) => c.colonyName !== ColonyName.VENUS);
    if (!this.gameOptions.turmoilExtension) colonyTiles = colonyTiles.filter((c) => c.colonyName !== ColonyName.PALLAS);
    this.gameColonies = colonyTiles.map((cf) => new cf.Factory());
  }

  private static includesCommunityColonies(gameOptions: GameOptions) : boolean {
    if (gameOptions.communityCardsOption) return true;
    const communityColonyNames = COMMUNITY_COLONIES_TILES.map((cf) => cf.colonyName);
    return gameOptions.customColoniesList.some((colonyName) => communityColonyNames.includes(colonyName));
  }

  private shuffle(cards: Array<IColony> | ReadonlyArray<IColony>): Array<IColony> {
    const deck: Array<IColony> = [];
    const copy = cards.slice();
    while (copy.length) {
      deck.push(copy.splice(Math.floor(this.rng.nextInt(copy.length)), 1)[0]);
    }
    return deck;
  }

  public drawColonies(players: number): void {
    const customColonies = this.gameOptions.customColoniesList;
    const colonies = customColonies.length === 0 ? this.gameColonies : this.gameColonies.filter((c) => customColonies.includes(c.name));

    const count = (players + 2) +
      (players <= 2 ? 1 : 0); // Two-player games and solo games get one more colony.

    if (colonies.length < count) {
      throw new Error(`Not enough valid colonies to choose from (want ${count}, has ${colonies.length}.) Remember that colonies like Venus and Pallas are invalid without Venus or Turmoil.`);
    }

    const tempDeck = this.shuffle(colonies);
    for (let i = 0; i < count; i++) {
      const colony = tempDeck.pop();
      if (colony === undefined) {
        throw new Error('Not enough colonies');
      }
      this.colonies.push(colony);
    }

    this.discardedColonies.push(...tempDeck);
    this.discardedColonies.sort((a, b) => (a.name > b.name) ? 1 : -1);
    this.colonies.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }

  public restore(activeColonies: Array<IColony>): void {
    this.colonies = [...activeColonies];
    this.discardedColonies = this.gameColonies.filter((c) => {
      return !activeColonies.some((ac) => ac.name === c.name);
    });
  }
}
