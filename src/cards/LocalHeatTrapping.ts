
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Tags } from "./Tags";
import { OrOptions } from '../inputs/OrOptions';
import { SelectOption } from "../inputs/SelectOption";
import { SelectCard } from "../inputs/SelectCard";
import { ResourceType } from '../ResourceType';
import { AndOptions } from "../inputs/AndOptions";
import { SelectAmount } from "../inputs/SelectAmount";
import { ICard } from './ICard';
import { CardName } from '../CardName';
import { Game } from "../Game";

export class LocalHeatTrapping implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.LOCAL_HEAT_TRAPPING;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
        const requiredHeatAmt = 5;

        // Helion must be able to pay for both the card and its effect
        if (player.canUseHeatAsMegaCredits) {
          return player.heat + player.megaCredits >= requiredHeatAmt + player.getCardCost(game, this)
        };

        return player.heat >= requiredHeatAmt || (player.isCorporation(CardName.STORMCRAFT_INCORPORATED) && (player.getResourcesOnCorporation() * 2) + player.heat >= 5 );
    }
    public play(player: Player) {
        const otherAnimalCards: Array<ICard> = player.getResourceCards(ResourceType.ANIMAL);
        let options: OrOptions | SelectOption;
        const gain4Plants = function () {
            player.plants += 4;
            return undefined;
        };
        if (otherAnimalCards.length === 0) {
            options = new SelectOption("Gain 4 plants", gain4Plants);
        } else {
            options = new OrOptions(
                new SelectOption("Gain 4 plants", gain4Plants),
                new SelectCard("Select card to add 2 animals", otherAnimalCards, (foundCards: Array<ICard>) => {
                    player.addResourceTo(foundCards[0], 2);
                    return undefined;
                }));
        };
        
        if (player.isCorporation(CardName.STORMCRAFT_INCORPORATED) 
          && player.getResourcesOnCorporation() > 0) {
            let heatAmount: number;
            let floaterAmount: number;
            return new AndOptions(
                () => {
                  if (
                    heatAmount +
                    (floaterAmount * 2) < 5
                  ) {
                    throw new Error('Need to pay 5 heat');
                  }
                  player.removeResourceFrom(player.corporationCard as ICard, floaterAmount);
                  player.heat -= heatAmount;
                  return options;
                },
                new SelectAmount("Select amount of heat to spend", (amount: number) => {
                  heatAmount = amount;
                  return undefined;
                }, player.heat),
                new SelectAmount("Select amount of floater on corporation to spend", (amount: number) => {
                  floaterAmount = amount;
                  return undefined;
                }, player.getResourcesOnCorporation()),

            );
          }

        // Handle edge case for Helion
        if (player.heat >= 5) {
          player.heat -= 5;
        } else {
          const shortfall = 5 - player.heat;
          player.heat = 0;
          player.megaCredits -= shortfall;
        }
        
        return options;
    }
}
