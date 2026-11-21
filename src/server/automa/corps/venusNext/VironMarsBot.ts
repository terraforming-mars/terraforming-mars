import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {isIActionCard} from '@/server/cards/ICard';
import {IProjectCard} from '@/server/cards/IProjectCard';

export class VironMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.VIRON,
      description: 'Tag: Microbe. Each active card with an action adds 1 floater and scores 1 VP at game end.',
      tags: [Tag.MICROBE],
      requiredExpansions: ['venus', 'colonies'],
    });
  }

  public override onProjectCardResolved(marsBot: IMarsBot, card: IProjectCard): void {
    if (card.type !== CardType.ACTIVE || !isIActionCard(card)) {
      return;
    }
    marsBot.addFloaters(1);
    marsBot.setCorpState('actionCardsPlayed', marsBot.getCorpState('actionCardsPlayed') + 1);
    marsBot.game.log('MarsBot (${0}): active card with an action played, +1 floater', (b) => b.cardName(this.name));
  }

  public override vpBonus(marsBot: IMarsBot): number {
    return marsBot.getCorpState('actionCardsPlayed');
  }
}
