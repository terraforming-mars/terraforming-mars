import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {ICeoCard} from './ICeoCard';
import {Tag} from '../../../common/cards/Tag';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {TITLES} from '../../inputs/titles';

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
    if (!super.canAct(player)) {
      return false;
    }
    return player.canAfford(8);
  }


  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    let ceosDrawn: Array<ICeoCard> = [
      game.ceoDeck.draw(game),
      game.ceoDeck.draw(game),
      game.ceoDeck.draw(game),
    ];

    // TODO(): This is not being tested, but currently every CEO is always playable
    ceosDrawn = ceosDrawn.filter((ceo) => {
      if (ceo.canPlay?.(player) === false) {
        game.ceoDeck.discard(ceo);
        game.log('${0} was discarded as ${1} could not play it.', (b) => b.card(ceo).player(player), {reservedFor: player});
        return false;
      }
      return true;
    });

    player.game.defer(new SelectPaymentDeferred(player, 8, {title: TITLES.payForCardAction(this.name)}));

    return new SelectCard('Choose CEO card to play', 'Play', ceosDrawn)
      .andThen(([chosenCeo]) => {
      // Discard unchosen CEOs
        ceosDrawn.filter((c) => c !== chosenCeo).forEach((c) => game.ceoDeck.discard(c));
        // Remove Lowell from played cards
        const lowellIndex = player.playedCards.findIndex((c) => c.name === this.name);
        player.playedCards.splice(lowellIndex, 1);
        // Add Lowell to Discard pile
        game.ceoDeck.discard(this);
        // Play the new CEO
        return player.playCard(chosenCeo);
      });
  }
}
