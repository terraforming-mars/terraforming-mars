import {BonusCardName} from '@/common/automa/BonusCardName';
import {CorporateCompetitionBase} from '@/server/automa/bonusCards/CorporateCompetitionBase';

/** Corporate Competition for Tharsis (B08). */
export class CorporateCompetition extends CorporateCompetitionBase {
  constructor() {
    super(BonusCardName.CORPORATE_COMPETITION);
  }
}
