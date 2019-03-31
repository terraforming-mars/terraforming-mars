
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Pets implements IProjectCard {
    public cost: number = 10;
    public animals: number = 0;
    public tags: Array<Tags> = [Tags.EARTH, Tags.ANIMAL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Pets";
    public text: string = "ANIMALS MAY NOT BE REMOVED FROM THIS CARD. Add 1 animal to this card every time a city tile is placed. Gain 1 victory point for every 2 animals on this card.";
    public description: string = "It wouldn't be the same without them";
    public play(player: Player, game: Game) {
        game.addCityTilePlacedListener(() => {
            this.animals++;
        });
        // 1 VP per 2 animals on card
        game.addGameEndListener(() => {
            player.victoryPoints += Math.floor(this.animals / 2);
        });
        this.animals++;
        return undefined;
    }
}
