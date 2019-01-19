
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class SpaceElevator implements IActiveProjectCard {
    public cost: number = 27;
    public tags: Array<Tags> = [Tags.SPACE, Tags.STEEL];
    public name: string = "Space Elevator";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 1 steel to gain 5 mega credits.";
    public text: string = "Increase your titanium production 1 step. Gain 2 victory points.";
    public description: string = "An ultra-strong cable car up to geo-stationary orbit, enabling reasonable export costs.";
    public play(player: Player, game: Game): Promise<void> {
        player.titaniumProduction++;
        player.victoryPoints += 2;
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        if (player.steel < 1) {
            return Promise.reject("Must have steel");
        }
        player.steel--;
        player.megaCredits += 5;
        return Promise.resolve();
    }
}

