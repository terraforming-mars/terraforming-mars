import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IPreludeCard} from '../prelude/IPreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectCard} from '../../inputs/SelectCard';

export class NewPartner extends PreludeCard {
  constructor() {
    super({
      name: CardName.NEW_PARTNER,

      behavior: {
        production: {megacredits: 1},
      },

      metadata: {
        cardNumber: 'P43',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).prelude().asterix();
        }),
        description: 'Raise your M€ production 1 step. Immediately draw 2 prelude cards. Play 1 of them, and discard the other.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    const cardsDrawn: Array<IPreludeCard> = [
      player.game.preludeDeck.draw(player.game),
      player.game.preludeDeck.draw(player.game),
    ];
    player.game.log(
      'You drew ${0} and ${1}',
      (b) => b.card(cardsDrawn[0]).card(cardsDrawn[1]),
      {reservedFor: player});

    const playableCards = cardsDrawn.filter((card) => card.canPlay(player) === true);
    if (playableCards.length === 0) {
      player.game.log('${0} and ${1} were discarded as ${2} could not pay for both cards.', (b) => b.card(cardsDrawn[0]).card(cardsDrawn[1]).player(player));
      return undefined;
    }

    return new SelectCard('Choose prelude card to play', 'Play', playableCards, ([card]) => {
      if (card.canPlay === undefined || card.canPlay(player)) {
        return player.playCard(card);
      } else {
        throw new Error('You cannot pay for this card');
      }
    });
  }
}
