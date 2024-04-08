import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {DrawCards} from '../../deferredActions/DrawCards';
import {Priority} from '../../deferredActions/Priority';
import {DiscardCards} from '../../deferredActions/DiscardCards';

export class Ender extends CeoCard {
  constructor() {
    super({
      name: CardName.ENDER,
      metadata: {
        cardNumber: 'L05',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().minus().text('2X').cards(1).plus().text('2X').cards(1);
        }),
        description: 'Once per game, discard any number of cards up to twice the current generation number to draw that many cards.',
      },
    });
  }

  public override canAct(player: IPlayer): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.cardsInHand.length > 0;
  }

  public action(player: IPlayer): undefined {
    this.isDisabled = true;
    const max = Math.min(player.cardsInHand.length, player.game.generation * 2);
    player.game.defer(new DiscardCards(player, 0, max), Priority.DISCARD_AND_DRAW)
      .andThen((cards) => player.game.defer(DrawCards.keepAll(player, cards.length)));
    return undefined;
  }
}
