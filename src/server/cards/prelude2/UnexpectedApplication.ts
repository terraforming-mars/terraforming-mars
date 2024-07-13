import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/Priority';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class UnexpectedApplication extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.UNEXPECTED_APPLICATION,
      type: CardType.EVENT,
      tags: [Tag.VENUS],
      cost: 4,

      behavior: {
        global: {venus: 1},
      },

      metadata: {
        cardNumber: 'P86',
        renderData: CardRenderer.builder((b) => {
          b.minus().cards(1).venus(1);
        }),
        description: 'Discard 1 card to terraform Venus 1 step.',
      },
    });
  }
  public override bespokeCanPlay(player: IPlayer) {
    return player.cardsInHand.length > 0;
  }
  public override bespokePlay(player: IPlayer) {
    player.game.defer(new DiscardCards(player, 1), Priority.DISCARD_CARDS);
    return undefined;
  }
}
