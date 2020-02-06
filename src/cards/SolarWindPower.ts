
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class SolarWindPower implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.SPACE, Tags.ENERGY];
    public name: string = "Solar Wind Power";
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
        player.setProduction(Resources.ENERGY);
        player.titanium += 2;
        return undefined;
    }
}
