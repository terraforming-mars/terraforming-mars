
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class PowerPlant implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: CardName = CardName.POWER_PLANT;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
        player.addProduction(Resources.ENERGY);
        return undefined;
    }
}

