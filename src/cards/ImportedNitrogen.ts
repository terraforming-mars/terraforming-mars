
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { AndOptions } from "../inputs/AndOptions";
import { SelectCard } from "../inputs/SelectCard";

export class ImportedNitrogen implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Imported Nitrogen";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise your terraform rating 1 step and gain 4 plants. Add 3 microbes to ANOTHER card and 2 animals to ANOTHER card.";
    public description: string = "Providing nitrogen needed in the atmosphere and for biomass.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        const otherAnimalCards = game.getOtherAnimalCards(this);
        const otherMicrobeCards = game.getOtherMicrobeCards(this);
        return new AndOptions(
            () => {
                player.terraformRating++;
                player.plants += 4;
                return undefined;
            },
            new SelectCard("Select card to add 3 microbes", otherMicrobeCards, (foundCards: Array<IProjectCard>) => {
                player.addResourceTo(foundCards[0], 3);
                return undefined;
            }),
            new SelectCard("Select card to add 2 animals", otherAnimalCards, (foundCards: Array<IProjectCard>) => {
                player.addResourceTo(foundCards[0], 2);
                return undefined;
            })
        );
    }
}
