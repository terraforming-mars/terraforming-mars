import {Tags} from "./Tags";
import {CardType} from "./CardType";
import {Player} from "../Player";
import {Game} from "../Game";
import {SelectCard} from "../inputs/SelectCard";
import {IActionCard} from "./ICard";
import {IProjectCard} from "./IProjectCard";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { LogHelper } from "../components/LogHelper";

export class BusinessNetwork implements IActionCard, IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.BUSINESS_NETWORK;
    public cardType: CardType = CardType.ACTIVE;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.MEGACREDITS) >= -4;
    }
    public play(player: Player) {
      player.setProduction(Resources.MEGACREDITS,-1);
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
        canSelectCard ? "Select" : undefined,
        [dealtCard],
        (cards: Array<IProjectCard>) => {
          if (cards.length === 0 || !canSelectCard) {
            LogHelper.logCardChange(game, player, "discarded", 1);
            game.dealer.discard(dealtCard);
            return undefined;
          }
          LogHelper.logCardChange(game, player, "drew", 1);
          player.cardsInHand.push(dealtCard);
          game.addSelectHowToPayInterrupt(player, player.cardCost, false, false, "Select how to pay for action");
          return undefined;
        }, canSelectCard ? 1 : 0 , 0
      );
    }
}
