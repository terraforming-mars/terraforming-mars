import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";

export class EarthElevator implements IProjectCard {
    public cost: number = 43;
    public tags: Array<Tags> = [Tags.SPACE, Tags.EARTH];
    public name: CardName = CardName.EARTH_ELEVATOR;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.TITANIUM, 3);  
      return undefined;
    }
    public getVictoryPoints() {
        return 4;
    }
}
