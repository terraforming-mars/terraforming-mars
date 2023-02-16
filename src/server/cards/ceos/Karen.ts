import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';

export class Karen extends CeoCard {
  constructor() {
    super({
      name: CardName.KAREN,
      metadata: {
        cardNumber: 'L11',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('X').prelude().asterix();
        }),
        description: 'Once per game, draw Prelude cards equal to the current generation number and choose one to play, and discard the rest.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    const cardsDrawn: Array<IProjectCard> = [];
    const game = player.game;
    for (let i = 0; i < game.generation; i++) {
      cardsDrawn.push(game.preludeDeck.draw(game));
    }

    cardsDrawn.forEach((card) => {
      if (card.canPlay?.(player) === false) {
        cardsDrawn.splice(cardsDrawn.indexOf(card), 1);
        game.log('${0} was discarded as ${1} could not play it,', (b) => b.card(card).player(player), {reservedFor: player});
      }
    });

    if (cardsDrawn.length === 0) {
      game.log('${0} drew no playable prelude cards', (b) => b.player(player));
      return undefined;
    }

    return new SelectCard('Choose prelude card to play', 'Play', cardsDrawn, ([card]) => {
      if (card.canPlay === undefined || card.canPlay(player)) {
        this.isDisabled = true;
        return player.playCard(card);
      } else {
        throw new Error('You cannot play this card');
      }
    });
  }
}
