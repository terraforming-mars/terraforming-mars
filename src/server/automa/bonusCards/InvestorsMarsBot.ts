import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';

export class InvestorsMarsBot extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B32_INVESTORS, name: CardName.AUTOMA_INVESTORS});
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
      marsBot.game.log('MarsBot (${0}): advance least-advanced track, move most-advanced track back', (b) => b.cardName(this.name));
    } else {
      const amount = marsBotBoard.tracks[leastIndex].position;
      marsBot.gainMc(amount);
      marsBot.game.log('MarsBot (${0}): +${1}:r:mc: from the least-advanced track', (b) => b.cardName(this.name).number(amount));
    }
    return false;
  }
}
