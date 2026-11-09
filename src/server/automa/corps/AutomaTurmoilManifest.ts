import {CardName} from '../../../common/cards/CardName';
import {AutomaManifest} from './AutomaManifest';
import {LAKEFRONT_RESORTS_MARSBOT_CORP} from './turmoil/LakefrontResortsMarsBot';
import {PRISTAR_MARSBOT_CORP} from './turmoil/PristarMarsBot';
import {SEPTUM_TRIBUS_MARSBOT_CORP} from './turmoil/SeptumTribusMarsBot';
import {TERRALABS_RESEARCH_MARSBOT_CORP} from './turmoil/TerralabsResearchMarsBot';
import {UTOPIA_INVEST_MARSBOT_CORP} from './turmoil/UtopiaInvestMarsBot';

export const AUTOMA_TURMOIL_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.LAKEFRONT_RESORTS]: LAKEFRONT_RESORTS_MARSBOT_CORP,
    [CardName.PRISTAR]: PRISTAR_MARSBOT_CORP,
    [CardName.SEPTUM_TRIBUS]: SEPTUM_TRIBUS_MARSBOT_CORP,
    [CardName.TERRALABS_RESEARCH]: TERRALABS_RESEARCH_MARSBOT_CORP,
    [CardName.UTOPIA_INVEST]: UTOPIA_INVEST_MARSBOT_CORP,
  },
};
