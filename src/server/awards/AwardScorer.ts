import {PlayerId} from '../../common/Types';
import {Game} from '../Game';
import {Player} from '../Player';
import {IAward} from './IAward';

export class AwardScorer {
  private scores: Map<PlayerId, number> = new Map();
  constructor(game: Game, award: IAward) {
    for (const player of game.getPlayers()) {
      const score = award.getScore(player);
      // if player  has asimov, add 2 to score
      this.scores.set(player.id, score);
    }
  }

  public get(player: Player): number {
    // Ideally throw when player does not match, but this is OK.
    return this.scores.get(player.id) ?? 0;
  }
}
