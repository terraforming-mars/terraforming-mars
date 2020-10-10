import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";

export class SolarReflectors implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.SOLAR_REFLECTORS;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.HEAT, 5);  
      return undefined;
    }
}
