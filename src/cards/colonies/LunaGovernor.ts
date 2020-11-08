import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Resources } from "../../Resources";

export class LunaGovernor implements IProjectCard {
    public cost = 4;
    public tags = [Tags.EARTH, Tags.EARTH];
    public name = CardName.LUNA_GOVERNOR;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.EARTH) >= 3;
    }

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);  
      return undefined;
    }
}
