
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class RadChemFactory implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = CardName.RAD_CHEM_FACTORY;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player) {
        player.setProduction(Resources.ENERGY,-1);
        player.terraformRating += 2;
        return undefined;
    }
}
