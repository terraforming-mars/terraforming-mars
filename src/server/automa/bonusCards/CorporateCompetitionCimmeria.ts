import {BonusCardName} from '@/common/automa/BonusCardName';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';

/** Vestigial: no effect yet. */
export class CorporateCompetitionCimmeria extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.CORPORATE_COMPETITION_CIMMERIA);
  }

  public override resolve(): boolean {
    // TODO(ignac8): Replace with implementation
    return false;
  }
}
