
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class SpaceElevator implements IActionCard, IProjectCard {
    public cost = 27;
    public tags = [Tags.SPACE, Tags.STEEL];
    public name = CardName.SPACE_ELEVATOR;
    public cardType = CardType.ACTIVE;

    public play(player: Player, _game: Game) {
        player.addProduction(Resources.TITANIUM);
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
    public getVictoryPoints() {
        return 2;
    }
}

