import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { CommercialDistrict } from "../CommercialDistrict";
import { IAdjacencyBonus, IAdjacencyBonusHelper } from "./IAdjacenyBonus";

export class CommercialDistrictAres extends CommercialDistrict implements IAdjacencyBonus {
  public name: CardName = CardName.COMMERCIAL_DISTRICT_ARES;

  giveAdjacencyBonus(player: Player, game: Game) :void {
    player.megaCredits += 2;
    IAdjacencyBonusHelper.logAdjacency(game, player, "2 M€", this.name);
  }
}
