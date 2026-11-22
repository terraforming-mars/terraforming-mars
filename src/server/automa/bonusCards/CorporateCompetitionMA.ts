import {BonusCardName} from '@/common/automa/BonusCardName';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';

/** Vestigial: no effect yet. */
export class CorporateCompetitionMA extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.CORPORATE_COMPETITION_MA);
  }

  public override resolve(): boolean {
    // TODO(ignac8): Replace with implementation
    return false;
  }
}
