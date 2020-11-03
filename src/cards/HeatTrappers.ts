import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { DecreaseAnyProduction } from "../deferredActions/DecreaseAnyProduction";

export class HeatTrappers implements IProjectCard {
    public cost = 6;
    public tags = [Tags.ENERGY, Tags.STEEL];
    public name = CardName.HEAT_TRAPPERS;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(_player: Player, game: Game): boolean {
        return game.someoneHasResourceProduction(Resources.HEAT,2);
    }
    
    public play(player: Player, game: Game) {
        game.defer(new DecreaseAnyProduction(player, game, Resources.HEAT, 2));
        player.addProduction(Resources.ENERGY);
        return undefined;
    }
    public getVictoryPoints() {
        return -1;
    }
}
