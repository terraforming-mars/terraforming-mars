import {IMarsBot} from '@/server/automa/IMarsBot';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';

export class Investors extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.INVESTORS);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // a. In an even generation, advance the least-advanced track and move the most-advanced track
    // back 1 space; b. otherwise gain 1 M€ per space of the least-advanced track. Ties go to the
    // upper track.
    const marsBotBoard = marsBot.marsBotBoard;
    const leastIndex = marsBotBoard.getLeastAdvancedTrackIndex();
    if (marsBot.game.generation % 2 === 0) {
      const mostIndex = marsBotBoard.getMostAdvancedTrackIndex();
      marsBot.maybeAdvanceTrack(leastIndex);
      marsBotBoard.tracks[mostIndex].regress();
      marsBot.game.log('MarsBot (${0}): advance least-advanced track, move most-advanced track back', (b) => b.bonusCardName(this.name));
    } else {
      const amount = marsBotBoard.tracks[leastIndex].position;
      marsBot.gainMc(amount);
      marsBot.game.log('MarsBot (${0}): +${1}:r:mc: from the least-advanced track', (b) => b.bonusCardName(this.name).number(amount));
    }
    return false;
  }
}
