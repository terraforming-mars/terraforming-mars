import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {DrawCards} from '../../deferredActions/DrawCards';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Size} from '../render/Size';

export class ReturntoAbandonedTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.RETURN_TO_ABANDONED_TECHNOLOGY,
      cost: 4,
      tags: [Tags.MARS],

      metadata: {
        cardNumber: 'Pf22',
        renderData: CardRenderer.builder((b) => {
          b.text('Draw the top 4 cards from the discard deck. Choose 2 to keep and discard the rest.', Size.SMALL).br;
        }),
      },
    });
  }

  public override canPlay(player: Player) {
    return player.game.dealer.discarded.length > 0;
  }

  public play(player: Player) {
    const cards: Array<IProjectCard> = [];
    for (let idx = 0; idx < 4; idx++) {
      const card = player.game.dealer.discarded.pop();
      if (card === undefined) break;
      cards.push(card);
    }

    const cardsToKeep = Math.min(2, cards.length);
    return DrawCards.choose(player, cards, {keepMax: cardsToKeep, logDrawnCard: true});
  }
}

