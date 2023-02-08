import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Priority} from '../../deferredActions/DeferredAction';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {DrawCards} from '../../deferredActions/DrawCards';
import {SelectAmount} from '../../inputs/SelectAmount';

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

  public override canAct(player: Player): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.cardsInHand.length > 0;
  }

  public action(player: Player): PlayerInput | undefined {
    const max = Math.min(player.cardsInHand.length, player.game.generation * 2);
    // TODO(d-little): Replace with SelectCard.
    return new SelectAmount(
      'Select number of cards to discard',
      'Discard cards',
      (amount: number) => {
        player.game.defer(new DiscardCards(player, amount), Priority.DISCARD_AND_DRAW);
        player.game.defer(DrawCards.keepAll(player, amount));
        this.isDisabled = true;
        return undefined;
      },
      1,
      max,
    );
  }
}
