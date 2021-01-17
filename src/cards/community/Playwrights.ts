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
                player.playCard(selectedCard);
                game.defer(new DeferredAction(player, () => {
                  for (const p of game.getPlayers()) {
                    const card = p.playedCards[p.playedCards.length - 1];

                    if (card !== undefined && card.name === selectedCard.name) {
                      p.playedCards.pop();
                      player.removedFromPlayCards.push(selectedCard); // Remove card from the game
                      return undefined;
                    }
                  }
                  return undefined;
                }));
              },
            },
          ));
          return undefined;
        },
      );
    }

    private getReplayableEvents(player: Player, game: Game): Array<IProjectCard> {
      const players = game.getPlayers();
      let playedEvents : IProjectCard[] = [];

      players.forEach((player) => {
        playedEvents.push(...player.playedCards.filter((card) => card.cardType === CardType.EVENT));
      });

      playedEvents = playedEvents.filter((card) => {
        const cost = player.getCardCost(game, card);
        const canAffordCard = player.canAfford(cost);
        const canPlayCard = card.canPlay === undefined || card.canPlay(player, game);
        return canAffordCard && canPlayCard;
      });

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
