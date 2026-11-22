import {CardName} from '@/common/cards/CardName';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {IProjectCard} from '@/server/cards/IProjectCard';

export class InventrixMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.INVENTRIX,
      description: 'Setup: remove Lobbyists. Effect: card with requirements gives 2 M€. Each generation: add Do It Right to action deck.',
      actionDeckBonusCard: BonusCardName.DO_IT_RIGHT,
    });
  }

  public override setup(marsBot: IMarsBot): void {
    // With Venus Next the bonus deck's Lobbyists is B15
    marsBot.removeBonusCard(BonusCardName.LOBBYISTS);
    marsBot.removeBonusCard(BonusCardName.LOBBYISTS_VENUS);
    marsBot.game.log('MarsBot (${0}): ${1} and ${2} removed from bonus deck', (b) => b.cardName(this.name).bonusCardName(BonusCardName.LOBBYISTS).bonusCardName(BonusCardName.LOBBYISTS_VENUS));
  }

  public override onProjectCardResolved(marsBot: IMarsBot, card: IProjectCard): void {
    if (card.requirements.length > 0) {
      marsBot.gainMc(2);
      marsBot.game.log('MarsBot (${0}): card with requirements, +2:r:mc:', (b) => b.cardName(this.name));
    }
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    marsBot.addBonusCardToActionDeck(BonusCardName.DO_IT_RIGHT);
  }
}
