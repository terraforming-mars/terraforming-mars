import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';

export class Diversification extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B28_DIVERSIFICATION, name: CardName.AUTOMA_DIVERSIFICATION});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const marsBotBoard = marsBot.marsBotBoard;
    const leastIndex = marsBotBoard.getLeastAdvancedTrackIndex();
    marsBot.maybeAdvanceTrack(leastIndex);
    const lost = marsBot.loseMc(4);
    marsBot.game.log('MarsBot (${0}): advance least-advanced track, lose ${1}:r:mc:', (b) => b.cardName(this.name).number(lost));
    return false;
  }
}
