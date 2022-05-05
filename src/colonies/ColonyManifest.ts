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
import {ColonyName} from '../common/colonies/ColonyName';
import {Iapetus} from '../cards/community/Iapetus';
import {Mercury} from '../cards/community/Mercury';
import {Hygiea} from '../cards/community/Hygiea';
import {Titania} from '../cards/community/Titania';
import {Venus} from '../cards/community/Venus';
import {Leavitt} from '../cards/community/Leavitt';
import {Pallas} from '../cards/community/Pallas';
import {GameModule} from '../common/cards/GameModule';

export interface IColonyFactory<T> {
  colonyName: ColonyName;
  Factory: new () => T;
}

export const BASE_COLONIES_TILES: Array<IColonyFactory<Colony>> = [
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

export const ALL_COLONIES_TILES = [...BASE_COLONIES_TILES, ...COMMUNITY_COLONIES_TILES];

export function getColonyModule(name: ColonyName): GameModule {
  if (COMMUNITY_COLONIES_TILES.some((f) => f.colonyName === name)) return 'community';
  return 'colonies';
}
