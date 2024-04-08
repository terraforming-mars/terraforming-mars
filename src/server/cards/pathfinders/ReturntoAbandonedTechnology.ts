import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {ChooseCards} from '../../deferredActions/ChooseCards';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {Size} from '../../../common/cards/render/Size';

export class ReturntoAbandonedTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.RETURN_TO_ABANDONED_TECHNOLOGY,
      cost: 4,
      tags: [Tag.MARS],

      metadata: {
        cardNumber: 'Pf22',
        renderData: CardRenderer.builder((b) => {
          b.text('Draw the top 4 cards from the discard pile. Choose 2 to keep and discard the rest.', Size.SMALL).br;
        }),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    return player.game.projectDeck.discardPile.length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    const cards = [];
    for (let idx = 0; idx < 4; idx++) {
      const card = player.game.projectDeck.discardPile.pop();
      if (card === undefined) break;
      cards.push(card);
    }

    const cardsToKeep = Math.min(2, cards.length);
    player.game.defer(new ChooseCards(player, cards, {keepMax: cardsToKeep}));

    return undefined;
  }
}

