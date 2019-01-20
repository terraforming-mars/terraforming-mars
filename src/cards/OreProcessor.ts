
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class OreProcessor implements IActiveProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Ore Processor";
    public cardType: CardType = CardType.ACTIVE;
    public text: "";
    public actionText: string = "Spend 4 energy to gain 1 titanium and increase oxygen 1 step";
    public description: string = "Processing ore";
    public play(player: Player, game: Game): Promise<void> {
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        if (player.energy < 4) {
            return Promise.reject("Requires 4 energy");
        }
        return game.increaseOxygenLevel(player).then(function () {
            player.titanium++;
        });
    }
}
