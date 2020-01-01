
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class PowerPlant implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = "Power Plant";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player) {
        player.setProduction(Resources.ENERGY);
        return undefined;
    }
}

