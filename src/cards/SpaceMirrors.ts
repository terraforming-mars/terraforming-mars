
import { Player } from "../Player";
import { Game } from "../Game";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";

export class SpaceMirrors implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.SPACE];
    public name: string = "Space Mirror";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 7 mega credit to increase your energy production 1 step.";
    public description: string = "Ultrathin mirrors reflecting sunlight down to receivers on the surface.";
    public text: string = "";
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public action(player: Player, _game: Game) {
        if (player.megaCredits < 7) {
            throw "Requires 7 mega credit";
        }
        player.megaCredits -= 7;
        player.energyProduction++;
        return undefined;
    }
}
