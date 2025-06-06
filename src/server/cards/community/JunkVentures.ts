import {CardName} from '../../../common/cards/CardName';
import {Size} from '../../../common/cards/render/Size';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {ChooseCards} from '../../deferredActions/ChooseCards';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class JunkVentures extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.JUNK_VENTURES,
      initialActionText: 'Discard the top 3 cards of the deck',
      startingMegaCredits: 43,

      metadata: {
        cardNumber: 'R49',
        description: 'You start with 43 M€. As your first action, discard the top 3 cards of the deck.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(43).text('DECK: ').minus().cards(3);
          b.corpBox('action', (cb) => {
            cb.text('ACTION: SHUFFLE THE DISCARD PILE, THEN DRAW 3 CARDS FROM IT. KEEP 1 AND DISCARD THE OTHER 2.', Size.SMALL, true);
          });
        }),
      },
    });
  }

  public initialAction(player: IPlayer) {
    const cards = player.game.projectDeck.drawN(player.game, 3);
    for (const card of cards) {
      player.game.projectDeck.discard(card);
    }
    return undefined;
  }

  public canAct(player: IPlayer): boolean {
    return player.game.projectDeck.discardPile.length >= 3;
  }

  public action(player: IPlayer) {
    const game = player.game;
    game.projectDeck.shuffleDiscardPile();

    const cards = [];
    for (let idx = 0; idx < 3; idx++) {
      const card = player.game.projectDeck.discardPile.pop();
      if (card === undefined) {
        break;
      }
      cards.push(card);
    }

    player.game.defer(new ChooseCards(player, cards, {keepMax: 1}));
    return undefined;
  }
}
