
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class TundraFarming implements IProjectCard {
    public cost: number = 16;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Tundra Farming";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -6 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
        player.plantProduction++;
        player.setProduction(Resources.MEGACREDITS,2);
        player.plants++;
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
} 
