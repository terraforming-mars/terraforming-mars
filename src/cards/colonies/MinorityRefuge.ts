
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Resources } from "../../Resources";

export class MinorityRefuge implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.MINORITY_REFUGE;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.MEGACREDITS) >= -3;
    }

    public play(player: Player, game: Game) {
      game.addColonyInterrupt(player, false, "Select colony for Minority Refuge");
      player.setProduction(Resources.MEGACREDITS, -2); 
      return undefined;
    }
}