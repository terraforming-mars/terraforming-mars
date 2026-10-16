import * as constants from '@/common/constants';
import {BoardName} from '@/common/boards/BoardName';
import {IPlayer} from '@/server/IPlayer';
import {PlaceOceanTile} from '@/server/deferredActions/PlaceOceanTile';
import {BuildColony} from '@/server/deferredActions/BuildColony';
import {Phase} from '@/common/Phase';

/**
 * A bonus printed on a global-parameter track, granted to the player who raises the parameter
 * across the threshold value (upward).
 *
 * Player benefits (production, cards, a colony, TR) are skipped during the solar (World Government)
 * phase; `ocean`/`temperature` apply regardless and can cascade.
 */
export type GlobalParameterTrackBonus =
  'heatproduction' |
  'ocean' |
  'temperature' |
  'plant' |
  'drawcard' |
  'colony' |
  'tr';

/**
 * A threshold on a global-parameter track and the bonus granted when the track rises from below
 * `value` to at-or-above it.
 */
export type GlobalParameterThreshold = {
  value: number;
  bonus: GlobalParameterTrackBonus;
};

/**
 * The bonuses printed along a map's temperature, oxygen and Venus tracks.
 *
 * Standard maps share the classic layout (heat production at -24/-20C, an ocean at 0C, a temperature
 * step at 8% oxygen, a card at 8% Venus, TR at 16% Venus). The larger Amazonis Planitia, with its
 * longer tracks, spreads out a richer set of bonuses.
 */
export type GlobalParameterTracks = {
  temperature: ReadonlyArray<GlobalParameterThreshold>;
  oxygen: ReadonlyArray<GlobalParameterThreshold>;
  venus: ReadonlyArray<GlobalParameterThreshold>;
};

const STANDARD: GlobalParameterTracks = {
  temperature: [
    {value: constants.TEMPERATURE_BONUS_FOR_HEAT_1, bonus: 'heatproduction'},
    {value: constants.TEMPERATURE_BONUS_FOR_HEAT_2, bonus: 'heatproduction'},
    {value: constants.TEMPERATURE_FOR_OCEAN_BONUS, bonus: 'ocean'},
  ],
  oxygen: [
    {value: constants.OXYGEN_LEVEL_FOR_TEMPERATURE_BONUS, bonus: 'temperature'},
  ],
  venus: [
    {value: constants.VENUS_LEVEL_FOR_CARD_BONUS, bonus: 'drawcard'},
    {value: constants.VENUS_LEVEL_FOR_TR_BONUS, bonus: 'tr'},
  ],
};

const AMAZONIS_PLANITIA: GlobalParameterTracks = {
  temperature: [
    {value: constants.TEMPERATURE_BONUS_FOR_HEAT_1, bonus: 'heatproduction'},
    {value: constants.TEMPERATURE_BONUS_FOR_HEAT_2, bonus: 'heatproduction'},
    {value: constants.TEMPERATURE_BONUS_FOR_PLANT, bonus: 'plant'},
    {value: constants.TEMPERATURE_FOR_OCEAN_BONUS, bonus: 'ocean'},
  ],
  oxygen: [
    {value: constants.OXYGEN_LEVEL_FOR_AMAZONIS_CARD_BONUS, bonus: 'drawcard'},
    {value: constants.OXYGEN_LEVEL_FOR_AMAZONIS_TEMPERATURE_BONUS, bonus: 'temperature'},
  ],
  venus: [
    {value: constants.VENUS_LEVEL_FOR_CARD_BONUS, bonus: 'drawcard'},
    {value: constants.VENUS_LEVEL_FOR_AMAZONIS_COLONY_BONUS, bonus: 'colony'},
    {value: constants.VENUS_LEVEL_FOR_AMAZONIS_TR_BONUS, bonus: 'tr'},
  ],
};

export function getGlobalParameterTracks(boardName: BoardName): GlobalParameterTracks {
  if (boardName === BoardName.AMAZONIS_PLANITIA) {
    return AMAZONIS_PLANITIA;
  } else {
    return STANDARD;
  }
}

/** Grants the bonuses on the `type` track crossed when it rises from `from` to `to`. */
export function grantGlobalParameterTrackBonuses(
  player: IPlayer,
  type: keyof GlobalParameterTracks,
  from: number,
  to: number): void {
  const solar = player.game.phase === Phase.SOLAR;
  const thresholds = player.game.globalParameterTracks[type];
  for (const {value, bonus} of thresholds) {
    if (from >= value || to < value) {
      continue;
    }
    switch (bonus) {
    case 'drawcard':
      if (!solar) {
        player.drawCard();
      }
      break;
    case 'heatproduction':
      if (!solar) {
        player.production.add('heat', 1, {log: true});
      }
      break;
    case 'plant':
      if (!solar) {
        player.production.add('plants', 1, {log: true});
      }
      break;
    case 'colony':
      if (!solar) {
        player.game.defer(new BuildColony(player));
      }
      break;
    case 'ocean':
      player.game.defer(new PlaceOceanTile(player, {title: 'Select space for ocean from temperature increase'}));
      break;
    case 'temperature':
      player.game.increaseTemperature(player, 1);
      break;
    case 'tr':
      if (!solar) {
        player.increaseTerraformRating(1);
      }
      break;
    default:
      throw new Error('Unknown value: ' + bonus);
    }
  }
}
