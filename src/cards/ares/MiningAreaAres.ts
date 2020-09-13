import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { MiningArea } from "../MiningArea";
import { IAdjacencyBonus, IAdjacencyBonusHelper } from "./IAdjacenyBonus";

export class MiningAreaAres extends MiningArea implements IAdjacencyBonus {
  public name: CardName = CardName.MINING_AREA_ARES;

  giveAdjacencyBonus(player: Player, game: Game) :void {
    throw new Error("Not complete: add an animal");

    // player.steel += 1;
    // player.titanium += 1;
    // IAdjacencyBonusHelper.logAdjacency(game, player, "1 steel or titanium who knows", this.name);
  }
}
