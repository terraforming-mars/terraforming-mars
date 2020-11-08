import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { SelectHowToPayDeferred } from "../deferredActions/SelectHowToPayDeferred";

export class UndergroundDetonations implements IActionCard, IProjectCard {
    public cost = 6;
    public tags = [Tags.STEEL];
    public name = CardName.UNDERGROUND_DETONATIONS;
    public cardType = CardType.ACTIVE;

    public canAct(player: Player): boolean {
        return player.canAfford(10);
    }
    public action(player: Player, game: Game) {
        game.defer(new SelectHowToPayDeferred(player, 10, false, false, "Select how to pay for action"));
        player.addProduction(Resources.HEAT,2);
        return undefined;
    }
    public play() {
        return undefined;
    }
}
