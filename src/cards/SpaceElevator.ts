
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class SpaceElevator implements IActionCard, IProjectCard {
    public cost: number = 27;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SPACE, Tags.STEEL];
    public name: string = "Space Elevator";
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.titaniumProduction++;
        player.victoryPoints += 2;
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.steel > 0;
    }
    public action(player: Player, _game: Game) {
        player.steel--;
        player.megaCredits += 5;
        return undefined;
    }
}

