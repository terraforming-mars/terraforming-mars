import {IMarsBot} from '@/server/automa/IMarsBot';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';

export class Diversification extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.DIVERSIFICATION);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const marsBotBoard = marsBot.marsBotBoard;
    const leastIndex = marsBotBoard.getLeastAdvancedTrackIndex();
    marsBot.maybeAdvanceTrack(leastIndex);
    const lost = marsBot.loseMc(4);
    marsBot.game.log('MarsBot (${0}): advance least-advanced track, lose ${1}:r:mc:', (b) => b.bonusCardName(this.name).number(lost));
    return false;
  }
}
