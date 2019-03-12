
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { SelectCard } from "../inputs/SelectCard";

export class LocalHeatTrapping implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: string = "Local Heat Trapping";
    public text: string = "Spend 5 heat to either gain 4 plants, or to add 2 animals to ANOTHER card.";
    public description: string = "Life can benefit from local hot spots";
    public play(player: Player, game: Game) {
        if (player.heat < 5) {
            throw "Not enough heat";
        }
        player.heat -= 5;
        const otherAnimalCards: Array<IProjectCard> = game.getOtherAnimalCards(this);
        const gain4Plants = function () {
            player.plants += 4;
            return undefined;
        };
        if (otherAnimalCards.length === 0) {
            gain4Plants();
            return undefined;
        }
        return new OrOptions(
            new SelectOption(this.name, "Gain 4 plants", gain4Plants),
            new SelectCard(this.name, "Select card to add 2 animals", otherAnimalCards, (foundCards: Array<IProjectCard>) => {
                player.addAnimalsToCard(foundCards[0], 2);
                return undefined;
            })
        );
    }
}
