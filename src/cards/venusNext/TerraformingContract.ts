import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class TerraformingContract implements IProjectCard {
    public cost = 8;
    public tags = [Tags.EARTH];
    public name = CardName.TERRAFORMING_CONTRACT;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getTerraformRating() >= 25 ;
      }
    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS,4);
        return undefined;
    }
}