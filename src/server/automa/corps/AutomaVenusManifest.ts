import {CardName} from '../../../common/cards/CardName';
import {AutomaManifest} from './AutomaManifest';
import {VIRON_MARSBOT_CORP} from './venusNext/VironMarsBot';
import {CELESTIC_MARSBOT_CORP} from './venusNext/CelesticMarsBot';
import {MORNING_STAR_INC_MARSBOT_CORP} from './venusNext/MorningStarIncMarsBot';
import {APHRODITE_MARSBOT_CORP} from './venusNext/AphroditeMarsBot';
import {STORMCRAFT_INCORPORATED_MARSBOT_CORP} from './colonies/StormCraftIncorporatedMarsBot';

export const AUTOMA_VENUS_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.VIRON]: VIRON_MARSBOT_CORP,
    [CardName.CELESTIC]: CELESTIC_MARSBOT_CORP,
    [CardName.MORNING_STAR_INC]: MORNING_STAR_INC_MARSBOT_CORP,
    [CardName.APHRODITE]: APHRODITE_MARSBOT_CORP,
    [CardName.STORMCRAFT_INCORPORATED]: STORMCRAFT_INCORPORATED_MARSBOT_CORP,
  },
};
