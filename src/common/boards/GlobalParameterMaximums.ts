import {BoardName} from './BoardName';
import * as constants from '@/common/constants';

/**
 * The maximum values of the four Mars global parameters.
 */
export type GlobalParameterMaximums = {
  oceans: number;
  temperature: number;
  oxygen: number;
  venus: number;
};

const STANDARD_MAXIMUMS: GlobalParameterMaximums = {
  oceans: constants.MAX_OCEAN_TILES,
  temperature: constants.MAX_TEMPERATURE,
  oxygen: constants.MAX_OXYGEN_LEVEL,
  venus: constants.MAX_VENUS_SCALE,
};

const AMAZONIS_PLANITIA_MAXIMUMS: GlobalParameterMaximums = {
  oceans: constants.MAX_OCEAN_TILES_AMAZONIS,
  temperature: constants.MAX_TEMPERATURE_AMAZONIS,
  oxygen: constants.MAX_OXYGEN_LEVEL_AMAZONIS,
  venus: constants.MAX_VENUS_SCALE_AMAZONIS,
};

export function getGlobalParameterMaximums(boardName: BoardName): Readonly<GlobalParameterMaximums> {
  if (boardName === BoardName.AMAZONIS_PLANITIA) {
    return AMAZONIS_PLANITIA_MAXIMUMS;
  }
  return STANDARD_MAXIMUMS;
}
