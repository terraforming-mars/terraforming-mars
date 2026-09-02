import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {DeltaProject} from './DeltaProject';

export const DELTA_PROJECT_CARD_MANIFEST = new ModuleManifest({
  module: 'deltaProject',
  preludeCards: {
    [CardName.DELTA_PROJECT]: {Factory: DeltaProject},
  },
});
