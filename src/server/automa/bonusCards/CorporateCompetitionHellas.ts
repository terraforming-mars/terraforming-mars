import {BonusCardName} from '@/common/automa/BonusCardName';
import {CorporateCompetitionBase} from '@/server/automa/bonusCards/CorporateCompetitionBase';

/** Corporate Competition for Hellas (B09). */
export class CorporateCompetitionHellas extends CorporateCompetitionBase {
  constructor() {
    super(BonusCardName.CORPORATE_COMPETITION_HELLAS);
  }
}
