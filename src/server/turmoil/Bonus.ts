import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {BonusId} from '../../common/turmoil/Types';
import {CardComponent} from '@/common/cards/render/CardComponent';

// Represents a Turmoil Chairman bonus.
export interface IBonus {
  id: BonusId;
  description: string;
  renderData: CardComponent;
  grantForPlayer?(player: IPlayer): void;
  grant(game: IGame): void;
  getScore(player: IPlayer): number;
}

export abstract class Bonus implements IBonus {
  public readonly id: BonusId;
  public readonly description: string;
  public readonly renderData: CardComponent;

  public grantForPlayer?(player: IPlayer): void;
  public abstract getScore(player: IPlayer): number;

  constructor(id: BonusId, description: string, renderData: CardComponent) {
    this.id = id;
    this.description = description;
    this.renderData = renderData;
  }

  public grant(game: IGame): void {
    for (const player of game.playersInGenerationOrder) {
      if (player.alliedParty === undefined) {
        this.grantForPlayer?.(player);
      }
    }
  }
}
