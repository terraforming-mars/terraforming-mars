
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class IndustrialMicrobes implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.MICROBES, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Industrial Microbes";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.STEEL);
        return undefined;
    }
}
 
