import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { ShiftAresGlobalParametersInterrupt } from "../../interrupts/ShiftAresGlobalParametersInterrupt";

export class ButterflyEffect implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.EVENT];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.BUTTERFLY_EFFECT;
    public play(player: Player, game: Game) {
      player.increaseTerraformRating(game);
      game.addInterrupt(new ShiftAresGlobalParametersInterrupt(game, player));
      return undefined;
    }
}
