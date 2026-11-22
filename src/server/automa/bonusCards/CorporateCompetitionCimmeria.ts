import {BonusCardName} from '@/common/automa/BonusCardName';
import {CorporateCompetitionBase} from '@/server/automa/bonusCards/CorporateCompetitionBase';

/** Corporate Competition for Terra Cimmeria (B12). */
export class CorporateCompetitionCimmeria extends CorporateCompetitionBase {
  constructor() {
    super(BonusCardName.CORPORATE_COMPETITION_CIMMERIA);
  }
}
