import {SpaceModel} from './SpaceModel';

export type MoonModel = {
  spaces: Array<SpaceModel>;
  habitatRate: number;
  miningRate: number;
  logisticsRate: number;
}
