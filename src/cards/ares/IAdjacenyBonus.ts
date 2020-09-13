import { Game } from "../../Game";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";
import { LogMessageType } from "../../LogMessageType";
import { Player } from "../../Player";

// Describes an Ares-based card whose tiles provide adjacency bonuses.
export interface IAdjacencyBonus {
  giveAdjacencyBonus(player: Player, game: Game) :void
}

export class IAdjacencyBonusHelper {
  public static isInstanceOf(object: any): object is IAdjacencyBonus {
    return 'giveAdjacencyBonus' in object;
  }

  public static logAdjacency(game: Game, player: Player, bonus: string, source: string) {
    game.log(
      LogMessageType.DEFAULT,
      "${0} gained a ${1} adjacency bonus for {2}",
      new LogMessageData(LogMessageDataType.PLAYER, player.id),
      new LogMessageData(LogMessageDataType.STRING, bonus),
      new LogMessageData(LogMessageDataType.CARD, source));
  }
}
