import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {ICeoCard} from './ICeoCard';
import {Tag} from '../../../common/cards/Tag';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

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

  public override canAct(player: Player): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.canAfford(8);
  }


  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const cardsDrawn: Array<ICeoCard> = [
      game.ceoDeck.draw(game),
      game.ceoDeck.draw(game),
      game.ceoDeck.draw(game),
    ];

    cardsDrawn.forEach((card) => {
      if (card.canPlay?.(player) === false) {
        cardsDrawn.splice(cardsDrawn.indexOf(card), 1);
        game.log('${0} was discarded as ${1} could not play it,', (b) => b.card(card).player(player), {reservedFor: player});
      }
    });

    player.game.defer(new SelectPaymentDeferred(player, 8, {title: 'Select how to pay for action'}));
    this.isDisabled = true;

    return new SelectCard('Choose CEO card to play', 'Play', cardsDrawn, (([card]) => {
      const cardIndex = player.playedCards.findIndex((c) => c.name === this.name);
      player.playedCards.splice(cardIndex, 1);
      game.ceoDeck.discard(this);

      return player.playCard(card);
    }));
  }
}
