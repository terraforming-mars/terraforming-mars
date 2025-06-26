import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {BonusId} from '../../common/turmoil/Types';

// Represents a Turmoil Chairman bonus.
export interface IBonus {
  id: BonusId;
  description: string;
  grantForPlayer?(player: IPlayer): void;
  grant(game: IGame): void;
  getScore(player: IPlayer): number;
}

export abstract class Bonus implements IBonus {
  abstract id: BonusId;
  abstract description: string;
  public abstract grantForPlayer(player: IPlayer): void;
  public abstract getScore(player: IPlayer): number;

  public grant(game: IGame): void {
    for (const player of game.getPlayersInGenerationOrder()) {
      if (player.alliedParty === undefined) {
        this.grantForPlayer?.(player);
      }
    }
  }
}
