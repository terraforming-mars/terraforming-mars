import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";

export class TerraformingContract implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Terraforming Contract";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.terraformRating >= 25 ;
      }
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,4);
        return undefined;
    }
}