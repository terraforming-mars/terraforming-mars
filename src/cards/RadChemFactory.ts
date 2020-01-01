
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class RadChemFactory implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Rad-chem Factory";
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player) {
        if (player.getProduction(Resources.ENERGY) < 1) {
            throw "Must have energy production";
        }
        player.setProduction(Resources.ENERGY,-1);
        player.terraformRating += 2;
        return undefined;
    }
}
