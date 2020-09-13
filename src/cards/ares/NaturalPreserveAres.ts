import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { NaturalPreserve } from "../NaturalPreserve";
import { IAdjacencyBonus, IAdjacencyBonusHelper } from "./IAdjacenyBonus";

export class NaturalPreserveAres extends NaturalPreserve implements IAdjacencyBonus {
  public name: CardName = CardName.NATURAL_PRESERVE_ARES;

  giveAdjacencyBonus(player: Player, game: Game) :void {
    player.megaCredits += 1;
    IAdjacencyBonusHelper.logAdjacency(game, player, "1 M€", this.name);
  }
}
