import {SpaceModel} from './SpaceModel';

export interface MoonModel {
  spaces: Array<SpaceModel>;
  colonyRate: number;
  miningRate: number;
  logisticsRate: number;
}
