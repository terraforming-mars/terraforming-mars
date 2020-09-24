import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";

export class ButterflyEffect implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.EVENT];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.BUTTERFLY_EFFECT;
    public play(player: Player, game: Game) {
      player.increaseTerraformRating(game);

      // TODO(kberg): move each individual hazard marker up or
      // down 1 step.
      return undefined;
    }
}
