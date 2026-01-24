import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludesExpansion} from '../../preludes/PreludesExpansion';

export class NewPartner extends PreludeCard {
  constructor() {
    super({
      name: CardName.NEW_PARTNER,

      behavior: {
        production: {megacredits: 1},
      },

      metadata: {
        cardNumber: 'X42',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).prelude().asterix();
        }),
        description: 'Raise your M€ production 1 step. Immediately draw 2 prelude cards. Play 1 of them, and discard the other.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    const game = player.game;
    if (!game.preludeDeck.canDraw(2)) {
      this.warnings.add('deckTooSmall');
    }
    return true;
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    const cards = game.preludeDeck.drawN(game, 2);
    return PreludesExpansion.selectPreludeToPlay(player, cards);
  }
}
