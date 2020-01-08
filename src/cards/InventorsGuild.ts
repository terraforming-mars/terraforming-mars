
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import {SelectCard} from '../inputs/SelectCard';
import { IProjectCard } from "./IProjectCard";
import { IActionCard } from "./ICard";

export class InventorsGuild implements IActionCard, IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Inventors' Guild";
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
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
                true, 3,
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
