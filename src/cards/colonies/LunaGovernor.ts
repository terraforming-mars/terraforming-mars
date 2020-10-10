import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";

export class LunaGovernor implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.EARTH, Tags.EARTH];
    public name: CardName = CardName.LUNA_GOVERNOR;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.EARTH) >= 3;
    }

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);  
      return undefined;
    }
}
