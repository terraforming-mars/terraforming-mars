
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { CardType } from "./CardType";
import { Resources } from "../Resources";


export class GHGFactories implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "GHG Factories";
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player) {
        if (player.getProduction(Resources.ENERGY) < 1) {
            throw "Must have energy production to decrease";
        }
        player.setProduction(Resources.ENERGY,-1);
        player.setProduction(Resources.HEAT,4);
        return undefined;
    }
}

