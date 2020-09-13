import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { LavaFlows } from "../LavaFlows";
import { IAdjacencyBonus, IAdjacencyBonusHelper } from "./IAdjacenyBonus";

export class LavaFlowsAres extends LavaFlows implements IAdjacencyBonus {
  public name: CardName = CardName.LAVA_FLOWS_ARES;

  giveAdjacencyBonus(player: Player, game: Game) :void {
    player.heat += 2;
    IAdjacencyBonusHelper.logAdjacency(game, player, "2 heat", this.name);
  }
}
