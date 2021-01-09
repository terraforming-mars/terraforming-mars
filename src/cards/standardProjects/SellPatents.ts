import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import {StandardProjectCard} from './StandardProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';

export class SellPatents extends StandardProjectCard {
  public name = CardName.STANDARD_SELL_PATENTS;
  public cost = 0;

  public canAct(player: Player): boolean {
    return player.cardsInHand.length > 0;
  }

  actionEssence(): void {
    // no-op
  }

  public action(player: Player, game: Game): SelectCard<IProjectCard> {
    return new SelectCard(
      'Sell patents',
      'Sell',
      player.cardsInHand,
      (foundCards: Array<IProjectCard>) => {
        player.megaCredits += foundCards.length;
        foundCards.forEach((card) => {
          for (let i = 0; i < player.cardsInHand.length; i++) {
            if (player.cardsInHand[i].name === card.name) {
              player.cardsInHand.splice(i, 1);
              break;
            }
          }
          game.dealer.discard(card);
        });
        this.projectPlayed(player, game);
        game.log('${0} sold ${1} patents', (b) => b.player(player).number(foundCards.length));
        return undefined;
      }, player.cardsInHand.length,
    );
  }

  public metadata: CardMetadata = {
    cardNumber: 'SP8',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Discard any number of cards to gain that amount of MC.', (eb) => {
        eb.text('X').cards(1).startAction.megacredits(0).multiplier;
      }),
    ),
  };
}
