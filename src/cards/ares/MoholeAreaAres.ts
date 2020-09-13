import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { MoholeArea } from "../MoholeArea";
import { IAdjacencyBonus, IAdjacencyBonusHelper } from "./IAdjacenyBonus";

export class MoholeAreaAres extends MoholeArea implements IAdjacencyBonus {
  public name: CardName = CardName.MOHOLE_AREA_ARES;

  giveAdjacencyBonus(player: Player, game: Game) :void {
    player.heat += 2;
    IAdjacencyBonusHelper.logAdjacency(game, player, "2 heat", this.name);
  }
}
