import {Card} from '../Card';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {SelectCard} from '../../inputs/SelectCard';

export class InventionContest extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.INVENTION_CONTEST,
      tags: [Tags.SCIENCE],
      cost: 2,

      metadata: {
        cardNumber: '192',
        renderData: CardRenderer.builder((b) => {
          b.text('Look at the top 3 cards from the deck. Take 1 of them into hand and discard the other two', CardRenderItemSize.SMALL, true);
        }),
      },
    });
  }

  public play(player: Player, game: Game): SelectCard<IProjectCard> {
    return player.drawCard(game, {amount: 1, from: 3})!;
  }
}
