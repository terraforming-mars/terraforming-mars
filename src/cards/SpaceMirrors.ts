
import { Player } from "../Player";
import { Game } from "../Game";
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";

export class SpaceMirrors implements IActiveProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.SPACE];
    public name: string = "Space Mirror";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 7 mega credit to increase your energy production 1 step.";
    public description: string = "Ultrathin mirrors reflecting sunlight down to receivers on the surface.";
    public text: string = "";
    public play(player: Player, game: Game): Promise<void> {
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        if (player.megaCredits < 7) {
            return Promise.reject("Requires 7 mega credit");
        }
        player.megaCredits -= 7;
        player.energyProduction++;
        return Promise.resolve();
    }
}
