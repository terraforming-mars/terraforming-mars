import { CardName } from "../../CardName";
import { ShiftAresGlobalParametersDeferred } from "../../deferredActions/ShiftAresGlobalParametersDeferred";
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
      game.defer(new ShiftAresGlobalParametersDeferred(game, player));
      return undefined;
    }
}
