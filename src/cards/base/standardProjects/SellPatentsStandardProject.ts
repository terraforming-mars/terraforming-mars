import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {StandardProjectCard} from '../../StandardProjectCard';
import {SelectCard} from '../../../inputs/SelectCard';
import {IProjectCard} from '../../IProjectCard';
import {multiplier} from '../../Options';

export class SellPatentsStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.SELL_PATENTS_STANDARD_PROJECT,
      cost: 0,
      metadata: {
        cardNumber: 'SP8',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Discard any number of cards to gain that amount of M€.', (eb) => {
            eb.text('X').cards(1).startAction.megacredits(0, {multiplier});
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return player.cardsInHand.length > 0;
  }

  actionEssence(): void {
    // no-op
  }

  public action(player: Player): SelectCard<IProjectCard> {
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
          player.game.dealer.discard(card);
        });
        this.projectPlayed(player);
        player.game.log('${0} sold ${1} patents', (b) => b.player(player).number(foundCards.length));
        return undefined;
      }, player.cardsInHand.length,
    );
  }
}
