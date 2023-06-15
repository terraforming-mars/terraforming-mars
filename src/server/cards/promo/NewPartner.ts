import {IPlayer} from '../../IPlayer';
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

  public override bespokePlay(player: IPlayer) {
    const cards: Array<IPreludeCard> = [
      player.game.preludeDeck.draw(player.game),
      player.game.preludeDeck.draw(player.game),
    ];

    // Sets fizzle warning for preludes.
    cards.forEach((card) => card.canPlay(player));

    return new SelectCard('Choose prelude card to play', 'Play', cards, ([card]) => {
      return player.playCard(card);
    });
  }
}
