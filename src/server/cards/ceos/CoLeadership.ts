import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
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
          b.text('Draw 3 CEO cards and take one to your hand, it will be played on your first turn. Discard the other 2.', Size.SMALL, true);
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    let ceosDrawn: Array<ICeoCard> = [
      game.ceoDeck.draw(game),
      game.ceoDeck.draw(game),
      game.ceoDeck.draw(game),
    ];

    // TODO(d-little): This is not being tested, but currently every CEO is always playable
    ceosDrawn = ceosDrawn.filter((ceo) => {
      if (ceo.canPlay?.(player) === false) {
        game.ceoDeck.discard(ceo);
        game.log('${0} was discarded as ${1} could not play it.', (b) => b.card(ceo).player(player), {reservedFor: player});
        return false;
      }
      return true;
    });

    if (ceosDrawn.length === 0) {
      game.log('${0} drew no playable CEO cards', (b) => b.player(player));
      return undefined;
    }

    return new SelectCard('Choose CEO card', 'Take', ceosDrawn)
      .andThen(([chosenCeo]) => {
      // Discard unchosen CEOs
        ceosDrawn.filter((c) => c !== chosenCeo).forEach((c) => game.ceoDeck.discard(c));
        // Add chosen CEO to hand
        player.ceoCardsInHand.push(chosenCeo);
        return undefined;
      });
  }
}

