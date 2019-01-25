
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Ironworks implements IActiveProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Ironworks";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 4 energy to gain 1 steel and increase oxygen 1 step";
    public text: string = "";
    public description: string = "Electrolysis of Martian soil yields both iron and oxygen, making it an important part of terraforming.";
    public play(_player: Player, _game: Game): Promise<void> {
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        if (player.energy < 4) {
            return Promise.reject("Need 4 energy to spend");
        }
        return game.increaseOxygenLevel(player).then(function () {
            player.energy -= 4;
            player.steel++;
        });
    }
}
