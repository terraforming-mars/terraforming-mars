import {IGame} from '../IGame';
import {DeltaProjectData} from './DeltaProjectData';
import {Color} from '../../common/Color';

export class DeltaProjectExpansion {
  private constructor() {}

  public static initialize(game: IGame): DeltaProjectData {
    const playerPositions = new Map<Color, number>();
    for (const player of game.playersInGenerationOrder) {
      playerPositions.set(player.color, 0);
    }
    return {
      playerPositions,
      claimed2VP: [],
      claimed5VP: [],
      jovianBonus: [],
    };
  }
}
