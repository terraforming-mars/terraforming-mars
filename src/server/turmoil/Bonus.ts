import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {BonusId} from '../../common/turmoil/Types';

// TODO(ryoku): Rename to IBonus
export interface IBonus {
  id: BonusId;
  description: string;
  grantForPlayer?(player: IPlayer): void;
  grant(game: IGame): void;
  getScore(player: IPlayer): number;
}

// TODO(ryoku): Rename to Bonus
export abstract class Bonus implements IBonus {
  abstract id: BonusId;
  abstract description: string;
  public abstract grantForPlayer(player: IPlayer): void;
  public abstract getScore(player: IPlayer): number;

  public grant(game: IGame): void {
    game.getPlayersInGenerationOrder().filter((p) => {
      return p.alliedParty === undefined;
    }).forEach((p) => this.grantForPlayer?.(p));
  }
}
