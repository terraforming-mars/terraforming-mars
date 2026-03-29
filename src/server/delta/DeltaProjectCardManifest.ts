import {CardName} from '../../common/cards/CardName';
import {ModuleManifest} from '../cards/ModuleManifest';
import {DeltaProjectPrelude} from './DeltaProjectPrelude';

export const DELTA_PROJECT_CARD_MANIFEST = new ModuleManifest({
  module: 'deltaProject',
  preludeCards: {
    [CardName.DELTA_PROJECT_PRELUDE]: {Factory: DeltaProjectPrelude},
  },
});
