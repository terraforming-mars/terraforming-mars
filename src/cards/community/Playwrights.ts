import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {Resources} from '../../Resources';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Playwrights implements CorporationCard {
    public name = CardName.PLAYWRIGHTS;
    public tags = [Tags.ENERGY];
    public startingMegaCredits: number = 38;
    public cardType = CardType.CORPORATION;
    private checkLoops: number = 0;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY);
      return undefined;
    }

    public canAct(player: Player, game: Game): boolean {
      const replayableEvents = this.getReplayableEvents(player, game);
      return replayableEvents.length > 0;
    }

    public action(player: Player, game: Game) {
      const players = game.getPlayers();
      const replayableEvents = this.getReplayableEvents(player, game);

      return new SelectCard<ICard>(
        'Select event card to replay at cost in MC and remove from play', 'Select', replayableEvents,
        (foundCards: Array<ICard>) => {
          const selectedCard = foundCards[0] as IProjectCard;

          players.forEach((player) => {
            const cardIndex = player.playedCards.findIndex((c) => c.name === selectedCard.name);
            if (cardIndex !== -1) player.playedCards.splice(cardIndex, 1);
          });

          const cost = player.getCardCost(game, selectedCard);
          game.defer(new SelectHowToPayDeferred(
            player,
            cost,
            {
              title: 'Select how to pay to replay the event',
              afterPay: () => {
                player.playCard(selectedCard, undefined, false); // Play the card but don't add it to played cards
                player.removedFromPlayCards.push(selectedCard); // Remove card from the game
                if (selectedCard.name === CardName.LAW_SUIT) {
                  /*
                   * If the card played is Law Suit we need to remove it from the newly sued player's played cards.
                   * Needs to be deferred to happen after Law Suit's `play()` method.
                   */
                  game.defer(new DeferredAction(player, () => {
                    game.getPlayers().some((p) => {
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

    private getReplayableEvents(player: Player, game: Game): Array<IProjectCard> {
      const playedEvents : IProjectCard[] = [];

      this.checkLoops++;
      game.getPlayers().forEach((p) => {
        playedEvents.push(...p.playedCards.filter((card) => {
          return card.cardType === CardType.EVENT &&
            player.canAfford(player.getCardCost(game, card)) &&
            (card.canPlay === undefined || card.canPlay(player, game));
        }));
      });
      this.checkLoops--;

      return playedEvents;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R40',
      description: 'You start with 38 MC and 1 Energy production.',
      renderData: CardRenderer.builder((b) => {
        b.br.br;
        b.megacredits(38).production((pb) => pb.energy(1));
        b.corpBox('action', (cb) => {
          cb.action('Replay a played event from any player by paying its cost ONLY in MC (discounts and rebates apply), then REMOVE IT FROM PLAY.', (eb) => {
            // TODO(chosta): find a reasonable way to represent "?" (alphanumeric maybe)
            // use 1000 as an id to tell Vue to render the '?'
            eb.megacredits(1000).startAction;
            eb.text('replay', CardRenderItemSize.SMALL, true);
            eb.nbsp.cards(1).any.secondaryTag(Tags.EVENT);
          });
        });
      }),
    }
}
