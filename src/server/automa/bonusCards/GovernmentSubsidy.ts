import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';

export class GovernmentSubsidy extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B31_GOVERNMENT_SUBSIDY, name: CardName.AUTOMA_GOVERNMENT_SUBSIDY});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    marsBot.player.increaseTerraformRating(1);
    marsBot.game.log('MarsBot (${0}): +1 TR', (b) => b.cardName(this.name));
    return false;
  }
}
