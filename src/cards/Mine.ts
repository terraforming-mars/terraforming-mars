
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class Mine implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MINE;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
        player.addProduction(Resources.STEEL);
        return undefined;
    }
}
