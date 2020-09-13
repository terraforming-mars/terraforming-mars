import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { IndustrialCenter } from "../IndustrialCenter";
import { IAdjacencyBonus, IAdjacencyBonusHelper } from "./IAdjacenyBonus";

export class IndustrialCenterAres extends IndustrialCenter implements IAdjacencyBonus {
  public name: CardName = CardName.INDUSTRIAL_CENTER_ARES;

  giveAdjacencyBonus(player: Player, game: Game) :void {
    player.steel += 1;
    IAdjacencyBonusHelper.logAdjacency(game, player, "2 steel", this.name);
  }
}
