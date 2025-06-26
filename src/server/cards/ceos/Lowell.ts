import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Tag} from '../../../common/cards/Tag';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {TITLES} from '../../inputs/titles';
import {DrawCeoCardFromDeck} from '../../deferredActions/DrawCeoCardFromDeck';

export class Lowell extends CeoCard {
  constructor() {
    super({
      name: CardName.LOWELL,
      tags: [Tag.WILD],
      metadata: {
        cardNumber: 'L12',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().megacredits(8).colon().text('CHANGE LEADER').asterix();
          b.br.br;
        }),
        description: 'Once per game, pay 8 M€ to draw 3 CEO cards and choose one to play. Discard this card.',
      },
    });
  }

  public override canAct(player: IPlayer): boolean {
    if (!player.game.ceoDeck.canDraw(3)) {
      this.warnings.add('deckTooSmall');
    }
    if (!super.canAct(player)) {
      return false;
    }
    return player.canAfford(8);
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;

    game.defer(new SelectPaymentDeferred(player, 8, {title: TITLES.payForCardAction(this.name)}))
      .andThen(() => {
        player.game.defer(new DrawCeoCardFromDeck(player, 3)).andThen((newCeo) => {
          if (newCeo !== undefined) {
            // Move Lowell to the discard pile
            player.playedCards.remove(this);
            game.ceoDeck.discard(this);
            // Play the new CEO
            player.playCard(newCeo);
          }
        });
      });
    return undefined;
  }
}
