import {CardName} from '../../../common/cards/CardName';
import {AutomaManifest} from './AutomaManifest';
import {VironMarsBot} from './venusNext/VironMarsBot';
import {CelesticMarsBot} from './venusNext/CelesticMarsBot';
import {MorningStarIncMarsBot} from './venusNext/MorningStarIncMarsBot';
import {AphroditeMarsBot} from './venusNext/AphroditeMarsBot';
import {StormCraftIncorporatedMarsBot} from './colonies/StormCraftIncorporatedMarsBot';

export const AUTOMA_VENUS_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.VIRON]: new VironMarsBot(),
    [CardName.CELESTIC]: new CelesticMarsBot(),
    [CardName.MORNING_STAR_INC]: new MorningStarIncMarsBot(),
    [CardName.APHRODITE]: new AphroditeMarsBot(),
    [CardName.STORMCRAFT_INCORPORATED]: new StormCraftIncorporatedMarsBot(),
  },
};
