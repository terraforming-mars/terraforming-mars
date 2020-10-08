
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class Sponsors implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.SPONSORS;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS,2);
        return undefined;
    }
}
