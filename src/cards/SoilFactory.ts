
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class SoilFactory implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Soil Factory"
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player) {
        if (player.getProduction(Resources.ENERGY) < 1) {
            throw "Must have energy production";
        }
        player.setProduction(Resources.ENERGY,-1);
        player.setProduction(Resources.PLANTS);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    } 
}
