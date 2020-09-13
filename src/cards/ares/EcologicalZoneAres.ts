import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { EcologicalZone } from "../EcologicalZone";
import { IAdjacencyBonus, IAdjacencyBonusHelper } from "./IAdjacenyBonus";

export class EcologicalZoneAres extends EcologicalZone implements IAdjacencyBonus {
  public name: CardName = CardName.ECOLOGICAL_ZONE_ARES;

  giveAdjacencyBonus(player: Player, game: Game) :void {
    throw new Error("Not complete: add an animal");
    // player.heat += 2;
    // IAdjacencyBonusHelper.logAdjacency(game, player, "2 heat", this.name);
  }
}
