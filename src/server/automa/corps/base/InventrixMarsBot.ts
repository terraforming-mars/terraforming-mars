import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {IProjectCard} from '@/server/cards/IProjectCard';

export class InventrixMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.INVENTRIX,
      description: 'Setup: remove Lobbyists. Effect: card with requirements gives 2 M€. Each generation: add Do It Right to action deck.',
      actionDeckBonusCard: BonusCardId.B25_DO_IT_RIGHT,
    });
  }

  public override setup(marsBot: IMarsBot): void {
    // With Venus Next the bonus deck's Lobbyists is B15
    marsBot.removeBonusCard(BonusCardId.B06_LOBBYISTS);
    marsBot.removeBonusCard(BonusCardId.B15_LOBBYISTS_VENUS);
    marsBot.game.log('MarsBot (${0}): ${1} and ${2} removed from bonus deck', (b) => b.cardName(this.name).cardName(createBonusCard(BonusCardId.B06_LOBBYISTS).name).cardName(createBonusCard(BonusCardId.B15_LOBBYISTS_VENUS).name));
  }

  public override onProjectCardResolved(marsBot: IMarsBot, card: IProjectCard): void {
    if (card.requirements.length > 0) {
      marsBot.gainMc(2);
      marsBot.game.log('MarsBot (${0}): card with requirements, +2:r:mc:', (b) => b.cardName(this.name));
    }
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    marsBot.addBonusCardToActionDeck(BonusCardId.B25_DO_IT_RIGHT);
  }
}
