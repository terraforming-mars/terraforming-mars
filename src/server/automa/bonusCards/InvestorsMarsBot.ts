import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {maybeAdvanceTrack} from '@/server/automa/bonusCards/bonusCardHelpers';

export class InvestorsMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B32_INVESTORS});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // Utopia Invest: a. in an even generation, advance the least-advanced track and move the
    // most-advanced track back 1 space; b. otherwise gain 1 M€ per space of the least-advanced
    // track. Ties go to the upper track.
    const name = createBonusCard(this.id).name;
    const marsBotBoard = marsBot.marsBotBoard;
    const leastIndex = marsBotBoard.getLeastAdvancedTrackIndex();
    if (marsBot.game.generation % 2 === 0) {
      const mostIndex = marsBotBoard.getMostAdvancedTrackIndex();
      maybeAdvanceTrack(marsBot, leastIndex);
      marsBotBoard.tracks[mostIndex].regress();
      marsBot.game.log('MarsBot (${0}): advance least-advanced track, move most-advanced track back', (b) => b.cardName(name));
    } else {
      const amount = marsBotBoard.tracks[leastIndex].position;
      marsBot.gainMc(amount);
      marsBot.game.log('MarsBot (${0}): +${1}:r:mc: from the least-advanced track', (b) => b.cardName(name).number(amount));
    }
    return false;
  }
}
