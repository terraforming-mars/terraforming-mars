import {IMarsBot} from '@/server/automa/IMarsBot';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';

export class GovernmentSubsidy extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.GOVERNMENT_SUBSIDY);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    marsBot.player.increaseTerraformRating(1);
    marsBot.game.log('MarsBot (${0}): +1 TR', (b) => b.bonusCardName(this.name));
    return false;
  }
}
