
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class RoverConstruction implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Rover Construction";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "Gain 1 victory point. When any city tile is placed, gain 2 mega credit.";
    public description: string = "Providing safe transport vehicles.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        player.victoryPoints++;
        game.addCityTilePlacedListener(() => {
            player.megaCredits += 2;
        });
        return undefined;
    }
}
