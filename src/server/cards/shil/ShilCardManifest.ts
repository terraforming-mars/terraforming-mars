import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {SophonSurveillanceNetwork} from './SophonSurveillanceNetwork';

export const SHIL_CARD_MANIFEST = new ModuleManifest({
  module: 'shil',
  projectCards: {
    [CardName.SOPHON_SURVEILLANCE_NETWORK]: {Factory: SophonSurveillanceNetwork},
  },
  corporationCards: {
    // Future corporations can be added here
  },
  preludeCards: {
    // Future preludes can be added here
  },
});

