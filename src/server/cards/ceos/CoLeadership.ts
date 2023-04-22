import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {Size} from '../../../common/cards/render/Size';
import {ICeoCard} from './ICeoCard';
import {SelectCard} from '../../inputs/SelectCard';
import {inplaceRemove} from '../../../common/utils/utils';

export class CoLeadership extends PreludeCard {
  constructor() {
    super({
      name: CardName.CO_LEADERSHIP,
      metadata: {
        cardNumber: 'xxx',
        renderData: CardRenderer.builder((b) => {
          b.text('Draw 3 CEO cards and take one to your hand, it will be played on your first turn. Discard the other 2.', Size.SMALL, true);
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

    cardsDrawn.forEach((ceo) => {
      if (ceo.canPlay?.(player) === false) {
        inplaceRemove(cardsDrawn, ceo);
        game.ceoDeck.discard(ceo);
        game.log('${0} was discarded as ${1} could not play it,', (b) => b.card(ceo).player(player), {reservedFor: player});
      }
    });

    if (cardsDrawn.length === 0) {
      game.log('${0} drew no playable CEO cards', (b) => b.player(player));
      return undefined;
    }

    return new SelectCard('Choose CEO card', 'Take', cardsDrawn, (([chosenCeo]) => {
      // Discard unchosen CEOs
      inplaceRemove(cardsDrawn, chosenCeo);
      cardsDrawn.forEach((ceo) => {
        game.ceoDeck.discard(ceo);
      });
      // Add chosen CEO to hand
      player.ceoCardsInHand.push(chosenCeo);
      return undefined;
    }));
  }
}

