import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { MiningRights } from "../MiningRights";
import { IAdjacencyBonus } from "./IAdjacenyBonus";

export class MiningRightsAres extends MiningRights implements IAdjacencyBonus {
  public name: CardName = CardName.MINING_RIGHTS_ARES;

  giveAdjacencyBonus(player: Player, game: Game): void {
    throw new Error("Not complete: add an animal");

    // player.steel += 1;
    // player.titanium += 1;
    // IAdjacencyBonusHelper.logAdjacency(game, player, "1 steel or titanium who knows", this.name);
  }  
}
