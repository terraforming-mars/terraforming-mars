import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";

export class CoronaExtractor implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.SPACE, Tags.ENERGY];
    public name: CardName = CardName.CORONA_EXTRACTOR;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 4;
    }

    public play(player: Player) {
      player.addProduction(Resources.ENERGY, 4);  
      return undefined;
    }
}
