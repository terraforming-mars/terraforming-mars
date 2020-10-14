import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class EnergyTapping implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: CardName = CardName.ENERGY_TAPPING;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public play(player: Player, game: Game) {
        player.addProduction(Resources.ENERGY);
        game.addResourceProductionDecreaseInterrupt(player, Resources.ENERGY, 1);
        return undefined;
    }

    public getVictoryPoints() {
        return -1;
    }
}
