import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import { ILeaderCard } from './ILeaderCard';

export class BoardOfDirectors extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.BOARD_OF_DIRECTORS,
      tags: [Tag.EARTH],
      startingMegaCredits: 32,
      initialActionText: 'Draw 5 CEO cards, and play 2 of them',

      // cardDiscount: {tag: Tag.CITY, amount: 2},
      metadata: {
        cardNumber: 'LC01',
        description: 'You start with 32 M€. As your first action, draw five CEO cards, and play two of them. Discard the other three.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(32).nbsp.text('2x CEO').asterix();
        }),
      },
    });
  }

  public initialAction(player: Player) {
    const game = player.game;
    game.log('${0} used Board of Directors first action', (b) => b.player(player));
    let leaderCardsDrawn: Array<IProjectCard> = [];
    for (let i = 0; i < 5; i++) {
      leaderCardsDrawn.push(game.leaderDeck.draw(game));
    }

    return new SelectCard(
      'Select 2 CEOs', 'Select', leaderCardsDrawn,
      (leaderCards: Array<ILeaderCard>) => {
        if (leaderCards.length !== 2) {
          throw new Error('Select 2 CEOs');
        }
        player.playCard(leaderCards[0]);
        player.playCard(leaderCards[1]);
        leaderCardsDrawn.forEach(card => game.leaderDeck.discard(card));
        return undefined;
      }, {min: 2, max: 2},
    )
  }
}
