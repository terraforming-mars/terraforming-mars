
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class MagneticFieldGenerators implements IProjectCard {
    public cost: number = 20;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MAGNETIC_FIELD_GENERATORS;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 4;
    }
    public play(player: Player) {
        player.setProduction(Resources.ENERGY,-4);
        player.setProduction(Resources.PLANTS,2);
        player.terraformRating += 3;
        return undefined;
    }
} 
