
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { IUserData } from "../IUserData";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";

export class LocalHeatTrapping implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: string = "Local Heat Trapping";
    public text: string = "Spend 5 heat to either gain 4 plants, or to add 2 animals to ANOTHER card.";
    public description: string = "Life can benefit from local hot spots";
    public needsUserData: IUserData = {
        options: "0 to gain 4 plants, or card name to add animals to"
    };
    public play(player: Player, game: Game, userData: IUserData): void {
        if (player.heat < 5) {
            throw "Not enough heat";
        }
        if (userData.options === "0") {
            player.plants += 4;
        } else {
            if (userData.options === "Local Heat Trapping") {
                throw "Animals must be added to ANOTHER card";
            }
            var findCard = player.playedCards.filter((card) => card.name === userData.options);
            if (findCard.length === 0) {
                throw "Player doesn't have card";
            }
            player.addAnimalsToCard(findCard[0], 2);
        }
        player.heat -= 5;
    }
        
}
