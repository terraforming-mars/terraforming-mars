import { Game } from "../../Game";
import { Player } from "../../Player";

// Describes an Ares-based card whose tiles provide adjacency bonuses.
export interface IAdjacencyCost {
  giveAdjacencyBonus(player: Player, game: Game) :void
}

export class IAdjacencyCostHelper {
  public static isInstanceOf(object: any): object is IAdjacencyCost {
    return 'giveAdjacencyBonus' in object;
  }
}
