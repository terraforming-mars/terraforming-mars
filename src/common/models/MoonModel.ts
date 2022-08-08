import {SpaceModel} from './SpaceModel';

export type MoonModel = {
  spaces: Array<SpaceModel>;
  colonyRate: number;
  miningRate: number;
  logisticsRate: number;
}
