import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Resources } from "../../Resources";

export class LunarMining implements IProjectCard {
    public cost = 11;
    public tags = [Tags.EARTH];
    public name = CardName.LUNAR_MINING;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.TITANIUM, Math.floor((player.getTagCount(Tags.EARTH)+1) / 2));  
      return undefined;
    }
}
