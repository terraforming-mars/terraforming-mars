import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {Size} from '../../../common/cards/render/Size';
import {DrawCeoCardFromDeck} from '../../deferredActions/DrawCeoCardFromDeck';
import {Phase} from '../../../common/Phase';

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

  public override bespokeCanPlay(player: IPlayer) {
    if (!player.game.ceoDeck.canDraw(3)) {
      this.warnings.add('deckTooSmall');
    }
    return true;
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    game.defer(new DrawCeoCardFromDeck(player, 3)).andThen((card) => {
      if (card !== undefined) {
        if (game.phase === Phase.ACTION) {
          if (player.canPlay(card)) {
            player.playCard(card);
          } else {
            game.log('Discarding ${0} because it is not playable', (b) => b.card(card));
            game.ceoDeck.discard(card);
          }
        } else {
          player.ceoCardsInHand.push(card);
        }
      }
    });
    return undefined;
  }
}
