import {CardName} from '../../../common/cards/CardName';
import {AutomaManifest} from './AutomaManifest';
import {LakefrontResortsMarsBot} from './turmoil/LakefrontResortsMarsBot';
import {PristarMarsBot} from './turmoil/PristarMarsBot';
import {SeptumTribusMarsBot} from './turmoil/SeptumTribusMarsBot';
import {TerralabsResearchMarsBot} from './turmoil/TerralabsResearchMarsBot';
import {UtopiaInvestMarsBot} from './turmoil/UtopiaInvestMarsBot';

export const AUTOMA_TURMOIL_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.LAKEFRONT_RESORTS]: new LakefrontResortsMarsBot(),
    [CardName.PRISTAR]: new PristarMarsBot(),
    [CardName.SEPTUM_TRIBUS]: new SeptumTribusMarsBot(),
    [CardName.TERRALABS_RESEARCH]: new TerralabsResearchMarsBot(),
    [CardName.UTOPIA_INVEST]: new UtopiaInvestMarsBot(),
  },
};
