
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Ironworks implements IActionCard, IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Ironworks";
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.energy >= 4;
    }
    public action(player: Player, game: Game) {
        player.energy -= 4;
        player.steel++;
        return game.increaseOxygenLevel(player, 1);
    }
}
