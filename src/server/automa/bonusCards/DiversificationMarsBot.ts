import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';

export class DiversificationMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B28_DIVERSIFICATION});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const marsBotBoard = marsBot.marsBotBoard;
    const leastIndex = marsBotBoard.getLeastAdvancedTrackIndex();
    marsBot.maybeAdvanceTrack(leastIndex);
    const lost = Math.min(4, marsBot.megacredits);
    marsBot.megacredits -= lost;
    marsBot.game.log('MarsBot (${0}): advance least-advanced track, lose ${1}:r:mc:', (b) => b.cardName(this.name).number(lost));
    return false;
  }
}
