import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Resources } from "../../Resources";

export class EarthElevator implements IProjectCard {
    public cost = 43;
    public tags = [Tags.SPACE, Tags.EARTH];
    public name = CardName.EARTH_ELEVATOR;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.TITANIUM, 3);  
      return undefined;
    }
    public getVictoryPoints() {
        return 4;
    }
}
