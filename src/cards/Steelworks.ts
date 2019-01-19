
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Steelworks implements IActiveProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Steelworks";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "";
    public actionText: string = "Spend 4 energy to gain 2 steel and increase oxygen 1 step.";
    public description: string = "Turning the soil into stee and oxygen sounds good. It just takes a lot of energy.";
    public action(player: Player, game: Game): Promise<void> {
        if (player.energy < 4) {
            return Promise.reject("Must have 4 energy to spend");
        }
        return game.increaseOxygenLevel(player).then(function () {
            player.energy -= 4;
            player.steel += 2;
        });
    }
    public play(player: Player, game: Game): Promise<void> {
        return Promise.resolve();
    }
}
