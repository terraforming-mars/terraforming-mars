import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import {SelectCard} from '../inputs/SelectCard';
import { IProjectCard } from "./IProjectCard";
import { IActionCard } from "./ICard";
import { CardName } from '../CardName';
import { LogHelper } from "../components/LogHelper";

export class InventorsGuild implements IActionCard, IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.INVENTORS_GUILD;
    public cardType: CardType = CardType.ACTIVE;

    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        const dealtCard = game.dealer.dealCard();
        const canSelectCard = player.canAfford(player.cardCost);
        return new SelectCard(
          canSelectCard ? "Select card to keep or none to discard" : "You cannot pay for this card" ,
          [dealtCard],
          (cards: Array<IProjectCard>) => {
            if (cards.length === 0 || !canSelectCard) {
              LogHelper.logCardChange(game, player, "discarded", 1);
              game.dealer.discard(dealtCard);
              return undefined;
            }
            if (player.canUseHeatAsMegaCredits && player.heat > 0) {
              return new SelectHowToPay(
                'Select how to pay and buy ' + dealtCard.name, false, false,
                true, player.cardCost,
                (htp) => {
                  if (htp.heat + htp.megaCredits < player.cardCost) {
                    game.dealer.discard(dealtCard);
                    throw new Error('Not enough spent to buy card');
                  }
                  player.megaCredits -= htp.megaCredits;
                  player.heat -= htp.heat;
                  LogHelper.logCardChange(game, player, "drew", 1);
                  player.cardsInHand.push(dealtCard);
                  return undefined;
                }
              );
            }
            LogHelper.logCardChange(game, player, "drew", 1);
            player.cardsInHand.push(dealtCard);
            player.megaCredits -= player.cardCost;
            return undefined;
          }, canSelectCard ? 1 : 0 , 0
        );
      }
}
