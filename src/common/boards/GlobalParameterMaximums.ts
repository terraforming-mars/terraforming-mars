import {BoardName} from './BoardName';
import {
  MAX_OCEAN_TILES,
  MAX_OCEAN_TILES_AMAZONIS,
  MAX_OXYGEN_LEVEL,
  MAX_OXYGEN_LEVEL_AMAZONIS,
  MAX_TEMPERATURE,
  MAX_TEMPERATURE_AMAZONIS,
  MAX_VENUS_SCALE,
  MAX_VENUS_SCALE_AMAZONIS,
} from '../constants';

/**
 * The maximum values of the four Mars global parameters.
 */
export type GlobalParameterMaximums = {
  oceans: number;
  temperature: number;
  oxygen: number;
  venus: number;
};

export function getGlobalParameterMaximums(boardName: BoardName): GlobalParameterMaximums {
  if (boardName === BoardName.AMAZONIS_PLANITIA) {
    return {
      oceans: MAX_OCEAN_TILES_AMAZONIS,
      temperature: MAX_TEMPERATURE_AMAZONIS,
      oxygen: MAX_OXYGEN_LEVEL_AMAZONIS,
      venus: MAX_VENUS_SCALE_AMAZONIS,
    };
  }
  return {
    oceans: MAX_OCEAN_TILES,
    temperature: MAX_TEMPERATURE,
    oxygen: MAX_OXYGEN_LEVEL,
    venus: MAX_VENUS_SCALE,
  };
}
