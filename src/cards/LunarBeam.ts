
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from '../CardName';

export class LunarBeam implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.EARTH, Tags.ENERGY];
    public name: string = CardName.LUNAR_BEAM;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS) >= -3;
    }
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,-2);
        player.setProduction(Resources.HEAT,2);
        player.setProduction(Resources.ENERGY,2);
        return undefined;
    }
}
