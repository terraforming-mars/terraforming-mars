import {BonusCardName} from '@/common/automa/BonusCardName';
import {CorporateCompetitionBase} from '@/server/automa/bonusCards/CorporateCompetitionBase';

/** Corporate Competition for Elysium (B10). */
export class CorporateCompetitionElysium extends CorporateCompetitionBase {
  constructor() {
    super(BonusCardName.CORPORATE_COMPETITION_ELYSIUM);
  }
}
