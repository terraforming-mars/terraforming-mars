import {Colony} from './Colony';
import {Europa} from './Europa';
import {Ganymede} from './Ganymede';
import {Titan} from './Titan';
import {Callisto} from './Callisto';
import {Triton} from './Triton';
import {Ceres} from './Ceres';
import {Luna} from './Luna';
import {Io} from './Io';
import {Miranda} from './Miranda';
import {Pluto} from './Pluto';
import {Enceladus} from './Enceladus';
import {Iapetus} from '../cards/community/Iapetus';
import {Mercury} from '../cards/community/Mercury';
import {ColonyName} from '../common/colonies/ColonyName';
import {Hygiea} from '../cards/community/Hygiea';
import {Titania} from '../cards/community/Titania';
import {Venus} from '../cards/community/Venus';
import {Leavitt} from '../cards/community/Leavitt';
import {Pallas} from '../cards/community/Pallas';
import {SerializedColonyDealer} from './SerializedColonyDealer';

// TODO(kberg): Add ability to hard-code chosen colonies, separate from customColoniesList, so as to not be
// forced to rely on randomness.
// TODO(kberg): Add ability to disable initial action that removes a colony in the solo game. (Or come up with
// a simple line of code to deal with solo games.)
export interface IColonyFactory<T> {
    colonyName: ColonyName;
    Factory: new () => T
}

// Rename to BASE_COLONIES_TILES or something.
export const ALL_COLONIES_TILES: Array<IColonyFactory<Colony>> = [
  {colonyName: ColonyName.CERES, Factory: Ceres},
  {colonyName: ColonyName.ENCELADUS, Factory: Enceladus},
  {colonyName: ColonyName.EUROPA, Factory: Europa},
  {colonyName: ColonyName.GANYMEDE, Factory: Ganymede},
  {colonyName: ColonyName.IO, Factory: Io},
  {colonyName: ColonyName.LUNA, Factory: Luna},
  {colonyName: ColonyName.MIRANDA, Factory: Miranda},
  {colonyName: ColonyName.TITAN, Factory: Titan},
  {colonyName: ColonyName.CALLISTO, Factory: Callisto},
  {colonyName: ColonyName.PLUTO, Factory: Pluto},
  {colonyName: ColonyName.TRITON, Factory: Triton},
];

export const COMMUNITY_COLONIES_TILES: Array<IColonyFactory<Colony>> = [
  {colonyName: ColonyName.IAPETUS, Factory: Iapetus},
  {colonyName: ColonyName.MERCURY, Factory: Mercury},
  {colonyName: ColonyName.HYGIEA, Factory: Hygiea},
  {colonyName: ColonyName.TITANIA, Factory: Titania},
  {colonyName: ColonyName.VENUS, Factory: Venus},
  {colonyName: ColonyName.LEAVITT, Factory: Leavitt},
  {colonyName: ColonyName.PALLAS, Factory: Pallas},
];

export const ALL_ALL_COLONIES_TILES = [...ALL_COLONIES_TILES, ...COMMUNITY_COLONIES_TILES];

export class ColonyDealer {
  public discardedColonies: Array<Colony> = [];

  private shuffle(cards: Array<Colony>): Array<Colony> {
    const deck: Array<Colony> = [];
    const copy = cards.slice();
    while (copy.length) {
      deck.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
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

  public static deserialize(d: SerializedColonyDealer | undefined): ColonyDealer {
    const colonyDealer = new ColonyDealer();
    if (d !== undefined) {
      colonyDealer.discardedColonies = Colony.deserializeColonies(d.discardedColonies);
    }
    return colonyDealer;
  }
}
