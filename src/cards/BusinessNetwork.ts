
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {OrOptions} from '../inputs/OrOptions';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {SelectOption} from '../inputs/SelectOption';
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';

export class BusinessNetwork implements IActionCard, IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = 'Business Network';
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = 'Look at the top card and either buy ' +
      'it or discard it.';
    public text: string = 'Decrease your mega credit production 1 step.';
    public requirements: undefined;
    public description: string = 'Investing in social events can open' +
      ' up new opportunities.';
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
      const dealtCard = game.dealer.dealCard();
      if (player.canAfford(3)) {
        if (player.canUseHeatAsMegaCredits && player.heat > 0) {
          return new OrOptions(
              new SelectHowToPay(
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
              ),
              new SelectOption('Discard ' + dealtCard.name, () => {
                game.dealer.discard(dealtCard);
                return undefined;
              })
          );
        }
        return new OrOptions(
            new SelectOption('Buy card ' + dealtCard.name, () => {
              player.megaCredits -= 3;
              player.cardsInHand.push(dealtCard);
              return undefined;
            }),
            new SelectOption('Discard ' + dealtCard.name, () => {
              game.dealer.discard(dealtCard);
              return undefined;
            })
        );
      }
      // card can't be afforded
      game.dealer.discard(dealtCard);
      return undefined;
    }
}
