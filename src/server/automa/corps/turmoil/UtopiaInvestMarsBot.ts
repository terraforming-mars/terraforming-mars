import {CardName} from '@/common/cards/CardName';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class UtopiaInvestMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.UTOPIA_INVEST,
      description: 'Tags: Building, Space. Each generation: add Investors bonus card to action deck.',
      tags: [Tag.BUILDING, Tag.SPACE],
      actionDeckBonusCard: BonusCardName.INVESTORS,
    });
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    marsBot.addBonusCardToActionDeck(BonusCardName.INVESTORS);
  }
}
