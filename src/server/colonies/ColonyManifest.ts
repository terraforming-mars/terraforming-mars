import {Colony} from '@/server/colonies/Colony';
import {Europa} from '@/server/colonies/Europa';
import {Ganymede} from '@/server/colonies/Ganymede';
import {Titan} from '@/server/colonies/Titan';
import {Callisto} from '@/server/colonies/Callisto';
import {Triton} from '@/server/colonies/Triton';
import {Ceres} from '@/server/colonies/Ceres';
import {Luna} from '@/server/colonies/Luna';
import {Io} from '@/server/colonies/Io';
import {Miranda} from '@/server/colonies/Miranda';
import {Pluto} from '@/server/colonies/Pluto';
import {Enceladus} from '@/server/colonies/Enceladus';
import {ColonyName} from '@/common/colonies/ColonyName';
import {Iapetus} from '@/server/cards/community/Iapetus';
import {Mercury} from '@/server/cards/community/Mercury';
import {Hygiea} from '@/server/cards/community/Hygiea';
import {Titania} from '@/server/cards/community/Titania';
import {Venus} from '@/server/cards/community/Venus';
import {Leavitt} from '@/server/cards/community/Leavitt';
import {Pallas} from '@/server/cards/community/Pallas';
import {GameModule} from '@/common/cards/GameModule';
import {IapetusII} from '@/server/cards/pathfinders/IapetusII';
import {Deimos} from '@/server/colonies/Deimos';
// import {LeavittII} from '@/server/cards/pathfinders/LeavittII';

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
  {colonyName: ColonyName.DEIMOS, Factory: Deimos},
];

export const PATHFINDERS_COLONIES_TILES: Array<IColonyFactory<Colony>> = [
  // {colonyName: ColonyName.LEAVITT_II, Factory: LeavittII},
  {colonyName: ColonyName.IAPETUS_II, Factory: IapetusII},
];

export const ALL_COLONIES_TILES = [...BASE_COLONIES_TILES, ...COMMUNITY_COLONIES_TILES, ...PATHFINDERS_COLONIES_TILES];

export function getColonyModule(name: ColonyName): GameModule {
  if (COMMUNITY_COLONIES_TILES.some((f) => f.colonyName === name)) return 'community';
  if (PATHFINDERS_COLONIES_TILES.some((f) => f.colonyName === name)) return 'pathfinders';
  return 'colonies';
}
