
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from '../CardName';

export class HeatTrappers implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: CardName = CardName.HEAT_TRAPPERS;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(_player: Player, game: Game): boolean {
        if (game.getPlayers().length == 1) return true;
        return game.getPlayers().filter((p) => p.getProduction(Resources.HEAT) > 1).length > 0;
    }
    
    public play(player: Player, game: Game) {
        game.addResourceProductionDecreaseInterrupt(player, Resources.HEAT, 2);
        player.setProduction(Resources.ENERGY);
        return undefined;
    }
    public getVictoryPoints() {
        return -1;
    }
}