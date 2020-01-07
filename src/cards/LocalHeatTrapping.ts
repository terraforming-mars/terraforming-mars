
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Tags } from "./Tags";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { SelectCard } from "../inputs/SelectCard";
import { ResourceType } from '../ResourceType';

export class LocalHeatTrapping implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: string = "Local Heat Trapping";
    public canPlay(player: Player): boolean {
        return player.heat >= 5;
    }
    public play(player: Player) {
        player.heat -= 5;
        const otherAnimalCards: Array<IProjectCard> = player.getResourceCards(ResourceType.ANIMAL);
        const gain4Plants = function () {
            player.plants += 4;
            return undefined;
        };
        if (otherAnimalCards.length === 0) {
            gain4Plants();
            return undefined;
        }
        return new OrOptions(
            new SelectOption("Gain 4 plants", gain4Plants),
            new SelectCard("Select card to add 2 animals", otherAnimalCards, (foundCards: Array<IProjectCard>) => {
                player.addAnimalsToCard(foundCards[0], 2);
                return undefined;
            })
        );
    }
}
