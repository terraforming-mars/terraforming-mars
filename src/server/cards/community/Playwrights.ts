import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {all} from '../Options';

export class Playwrights extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.PLAYWRIGHTS,
      tags: [Tag.ENERGY],
      startingMegaCredits: 38,
      cardType: CardType.CORPORATION,

      behavior: {
        production: {energy: 1},
      },

      metadata: {
        cardNumber: 'R40',
        description: 'You start with 38 M€ and 1 Energy production.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(38).production((pb) => pb.energy(1));
          b.corpBox('action', (cb) => {
            cb.action('Replay a played event from any player by paying its cost ONLY in M€ (discounts and rebates apply), then REMOVE IT FROM PLAY.', (eb) => {
              // TODO(chosta): find a reasonable way to represent "?" (alphanumeric maybe)
              // use 1000 as an id to tell Vue to render the '?'
              eb.megacredits(1000).startAction;
              eb.text('replay', Size.SMALL, true);
              eb.nbsp.cards(1, {all, secondaryTag: Tag.EVENT});
            });
          });
        }),
      },
    });
  }

  // For Project Inspection
  private checkLoops = 0;

  public canAct(player: Player): boolean {
    const replayableEvents = this.getReplayableEvents(player);
    return replayableEvents.length > 0;
  }

  public action(player: Player): SelectCard<IProjectCard> | undefined {
    const players = player.game.getPlayers();
    const replayableEvents = this.getReplayableEvents(player);

    return new SelectCard<IProjectCard>(
      'Select event card to replay at cost in M€ and remove from play', 'Select', replayableEvents,
      ([card]) => {
        const selectedCard: IProjectCard = card;

        players.forEach((p) => {
          const cardIndex = p.playedCards.findIndex((c) => c.name === selectedCard.name);
          if (cardIndex !== -1) {
            p.playedCards.splice(cardIndex, 1);
          }
        });

        const cost = player.getCardCost(selectedCard);
        player.game.defer(new SelectPaymentDeferred(
          player,
          cost,
          {
            title: 'Select how to pay to replay the event',
            afterPay: () => {
              player.playCard(selectedCard, undefined, 'nothing'); // Play the card but don't add it to played cards
              player.removedFromPlayCards.push(selectedCard); // Remove card from the game
              if (selectedCard.name === CardName.LAW_SUIT) {
                /*
                   * If the card played is Law Suit we need to remove it from the newly sued player's played cards.
                   * Needs to be deferred to happen after Law Suit's `play()` method.
                   */
                player.game.defer(new SimpleDeferredAction(player, () => {
                  player.game.getPlayers().some((p) => {
                    const card = p.playedCards[p.playedCards.length - 1];
                    if (card?.name === selectedCard.name) {
                      p.playedCards.pop();
                      return true;
                    }
                    return false;
                  });
                  return undefined;
                }));
              }
            },
          },
        ));
        return undefined;
      },
    );
  }

  public getCheckLoops(): number {
    return this.checkLoops;
  }

  private getReplayableEvents(player: Player): Array<IProjectCard> {
    const playedEvents : IProjectCard[] = [];

    this.checkLoops++;
    try {
      player.game.getPlayers().forEach((p) => {
        playedEvents.push(...p.playedCards.filter((card) => {
          return card.cardType === CardType.EVENT &&
          // Can player.canPlay(card) replace this?
          player.canAfford(player.getCardCost(card), {
            reserveUnits: MoonExpansion.adjustedReserveCosts(player, card),
          }) && player.canPlayIgnoringCost(card);
        }));
      });
    } finally {
      this.checkLoops--;
    }

    return playedEvents;
  }
}
