import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Size} from '../../../common/cards/render/Size';

export class CompanyCartel extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.COMPANY_CARTEL,
      cost: 8,
      metadata: {
        cardNumber: 'B50',
        description: 'Draw cards equal to 2× the number of players. Each player picks 1 card to keep. Discard the rest.',
        renderData: CardRenderer.builder((b) => {
          b.text('Draw 2×players. Each player keeps 1. Discard rest.', Size.SMALL, false);
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const game = player.game;
    const players = game.players;
    const drawn = game.projectDeck.drawN(game, players.length * 2);
    // TODO: implement sequential deferred selection so each player interactively picks a card
    if (drawn.length > 0) player.cardsInHand.push(drawn.shift()!);
    for (const other of players) {
      if (other === player) continue;
      if (drawn.length === 0) break;
      other.cardsInHand.push(drawn.shift()!);
    }
    drawn.forEach((c) => game.projectDeck.discard(c));
    return undefined;
  }
}
