import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { DecreaseAnyProduction } from "../deferredActions/DecreaseAnyProduction";

export class EnergyTapping implements IProjectCard {
    public cost = 3;
    public tags = [Tags.ENERGY];
    public name = CardName.ENERGY_TAPPING;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public play(player: Player, game: Game) {
        player.addProduction(Resources.ENERGY);
        game.defer(new DecreaseAnyProduction(player, game, Resources.ENERGY, 1));
        return undefined;
    }

    public getVictoryPoints() {
        return -1;
    }
}
