
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {SelectCard} from '../../inputs/SelectCard';

export class BusinessContacts extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BUSINESS_CONTACTS,
      tags: [Tags.EARTH],
      cost: 7,

      metadata: {
        cardNumber: '111',
        renderData: CardRenderer.builder((b) => b.text('Look at the top 4 cards from the deck. Take 2 of them into hand and discard the other 2.', CardRenderItemSize.SMALL, true)),
      },
    });
  }
  public play(player: Player, game: Game): SelectCard<IProjectCard> | undefined {
    return player.drawCard(game, {amount: 2, from: 4});
  }
}
