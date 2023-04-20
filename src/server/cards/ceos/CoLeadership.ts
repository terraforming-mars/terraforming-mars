import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {Size} from '../../../common/cards/render/Size';
import {ICeoCard} from './ICeoCard';
import {SelectCard} from '../../inputs/SelectCard';

export class CoLeadership extends PreludeCard {
  constructor() {
    super({
      name: CardName.CO_LEADERSHIP,
      metadata: {
        cardNumber: 'xxx',
        renderData: CardRenderer.builder((b) => {
          b.text('Draw 3 CEO cards and immediately play one of them. Discard the other 2.', Size.SMALL, true);
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
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

    return new SelectCard('Choose CEO card to play', 'Play', cardsDrawn, (([card]) => {
      return player.playCard(card);
    }));
  }
}

