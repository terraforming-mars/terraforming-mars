import {BonusCardName} from '@/common/automa/BonusCardName';
import {CorporateCompetitionBase} from '@/server/automa/bonusCards/CorporateCompetitionBase';

/** Corporate Competition for the Milestones & Awards expansion (B14). */
export class CorporateCompetitionMA extends CorporateCompetitionBase {
  constructor() {
    super(BonusCardName.CORPORATE_COMPETITION_MA);
  }
}
