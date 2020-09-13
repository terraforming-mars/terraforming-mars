import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { RestrictedArea } from "../RestrictedArea";
import { IAdjacencyBonus, IAdjacencyBonusHelper } from "./IAdjacenyBonus";

export class RestrictedAreaAres extends RestrictedArea implements IAdjacencyBonus {
  public name: CardName = CardName.RESTRICTED_AREA_ARES;

  giveAdjacencyBonus(player: Player, game: Game) :void {
    player.cardsInHand.push(game.dealer.dealCard());
    IAdjacencyBonusHelper.logAdjacency(game, player, "1 card", this.name);
  }
}
