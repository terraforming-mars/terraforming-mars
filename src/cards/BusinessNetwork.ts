
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectCard} from '../inputs/SelectCard';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';

export class BusinessNetwork implements IActionCard, IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = 'Business Network';
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(player: Player): boolean {
      return player.megaCreditProduction >= -4;
    }
    public play(player: Player) {
      player.megaCreditProduction--;
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player, game: Game) {
      if (!player.canAfford(3)) {
          return undefined;
      }
      const dealtCard = game.dealer.dealCard();
      return new SelectCard(
        "Select card to keep or none to discard",
        [dealtCard],
        (cards: Array<IProjectCard>) => {
          if (cards.length === 0) {
            game.dealer.discard(dealtCard);
            return undefined;
          }
          if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            return new SelectHowToPay(
              'Select how to pay and buy ' + dealtCard.name, false, false,
              true, false,
              (htp) => {
                if (htp.heat + htp.megaCredits < 3) {
                  game.dealer.discard(dealtCard);
                  throw new Error('Not enough spent to buy card');
                }
                player.megaCredits -= htp.megaCredits;
                player.heat -= htp.heat;
                player.cardsInHand.push(dealtCard);
                return undefined;
              }
            );
          }
          player.cardsInHand.push(dealtCard);
          player.megaCredits -= 3;
          return undefined;
        }, 1, 0
      );
    }
}
