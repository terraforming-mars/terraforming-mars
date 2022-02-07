import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
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
        renderData: CardRenderer.builder((b) => b.text('Look at the top 4 cards from the deck. Take 2 of them into hand and discard the other 2.', Size.SMALL, true)),
      },
    });
  }
  public play(player: Player): SelectCard<IProjectCard> | undefined {
    return player.drawCardKeepSome(4, {keepMax: 2});
  }
}
