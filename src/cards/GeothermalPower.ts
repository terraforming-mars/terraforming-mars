
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class GeothermalPower implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.GEOTHERMAL_POWER;

    public play(player: Player) {
        player.addProduction(Resources.ENERGY,2);
        return undefined;
    }
}
