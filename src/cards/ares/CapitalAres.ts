import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { Capital } from "../Capital";
import { IAdjacencyBonus, IAdjacencyBonusHelper } from "./IAdjacenyBonus";

export class CapitalAres extends Capital implements IAdjacencyBonus {
  public name: CardName = CardName.CAPITAL_ARES;

  giveAdjacencyBonus(player: Player, game: Game) :void {
    player.megaCredits += 2;
    IAdjacencyBonusHelper.logAdjacency(game, player, "2 M€", CardName.CAPITAL_ARES);
  }
}
