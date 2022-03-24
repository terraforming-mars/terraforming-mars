import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {LogHelper} from '../../LogHelper';
import {SelectCard} from '../../inputs/SelectCard';
import {DeferredAction, Priority} from '../..//deferredActions/DeferredAction';

export class CharityDonation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.CHARITY_DONATION,
      tags: [Tags.MARS],
      cost: 7,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'Pf58',
        renderData: CardRenderer.builder((b) =>
          b.text('Reveal cards from the deck equal to the player count plus 1.')
            .br
            .text('In player order starting with you, each player takes one card in hand. Discard the remaining card.')),
      },
    });
  }

  public play(player: Player) {
    const game = player.game;
    const players = game.getPlayersInGenerationOrder();
    const thisIdx = players.findIndex((p) => p === player);
    const cards = game.dealer.drawProjectCardsByCondition(game, players.length + 1, () => true);
    // TODO(kberg): log the drawn cards after raising the planetary track.
    LogHelper.logDrawnCards(player, cards);
    game.defer(new SelectCharityDonationCard(players, thisIdx, thisIdx, cards));
    return undefined;
  }
}

export class SelectCharityDonationCard implements DeferredAction {
  public priority = Priority.DRAW_CARDS;
  public player: Player;
  constructor(private players: Array<Player>, private playerIdx: number, private boundaryIndex: number, private cards: Array<IProjectCard>) {
    this.player = this.players[playerIdx];
  }

  public execute() {
    return new SelectCard(
      'Select a card to keep',
      'Choose',
      this.cards,
      (cards) => {
        const game = this.player.game;
        const card = cards[0];

        const cardIdx = this.cards.indexOf(card);
        if (cardIdx > -1) {
          this.cards.splice(cardIdx, 1);
        }

        this.player.cardsInHand.push(card);
        game.log('${0} drew ${1}', (b) => b.player(this.player).card(card));

        const nextIndex = (this.playerIdx + 1) % this.players.length;
        if (nextIndex !== this.boundaryIndex) {
          game.defer(new SelectCharityDonationCard(this.players, nextIndex, this.boundaryIndex, this.cards));
        } else {
          game.dealer.discard(this.cards[0]);
          game.log('${0} was discarded.', (b) => b.card(this.cards[0]));
        }
        return undefined;
      },
    );
  }
}
