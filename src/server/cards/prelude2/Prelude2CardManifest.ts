import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {DirectedHeatUsage} from './DirectedHeatUsage';

export const PRELUDE2_CARD_MANIFEST = new ModuleManifest({
  module: 'prelude2',
  projectCards: {
    [CardName.DIRECTED_HEAT_USAGE]: {Factory: DirectedHeatUsage},
  },

  corporationCards: {
  },

  preludeCards: {
  },
});
