
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Tags } from "./Tags";
import { OrOptions } from '../inputs/OrOptions';
import { SelectOption } from "../inputs/SelectOption";
import { SelectCard } from "../inputs/SelectCard";
import { ResourceType } from '../ResourceType';
import { CorporationName } from "../CorporationName";
import { CardName } from "../CardName";
import { AndOptions } from "../inputs/AndOptions";
import { StormCraftIncorporated } from "./colonies/StormCraftIncorporated";
import { SelectAmount } from "../inputs/SelectAmount";

export class LocalHeatTrapping implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: string = "Local Heat Trapping";
    public canPlay(player: Player): boolean {
        return player.heat >= 5 || (player.isCorporation(CorporationName.STORMCRAFT_INCORPORATED) && (player.getResourcesOnCardname(CardName.STORMCRAFT_INCORPORATED) * 2) + player.heat >= 5 );
    }
    public play(player: Player) {
        const otherAnimalCards: Array<IProjectCard> = player.getResourceCards(ResourceType.ANIMAL);
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
                new SelectCard("Select card to add 2 animals", otherAnimalCards, (foundCards: Array<IProjectCard>) => {
                    player.addAnimalsToCard(foundCards[0], 2);
                    return undefined;
                }));
        };
        
        if (player.isCorporation(CorporationName.STORMCRAFT_INCORPORATED) && player.getResourcesOnCardname(CardName.STORMCRAFT_INCORPORATED) > 0 ) {
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
                  player.removeResourceFrom(new StormCraftIncorporated, floaterAmount);
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
                }, player.getResourcesOnCardname(CardName.STORMCRAFT_INCORPORATED)),

            );
          }

        player.heat -= 5;
        return options;
    }
}
