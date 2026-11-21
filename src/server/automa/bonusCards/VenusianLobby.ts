import {GlobalParameter} from '@/common/GlobalParameter';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';

export class VenusianLobby extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B26_VENUSIAN_LOBBY, name: CardName.AUTOMA_VENUSIAN_LOBBY});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    if (marsBot.game.gameOptions.expansions.venus) {
      if (marsBot.game.getVenusScaleLevel() < marsBot.game.max.venus && !marsBot.interceptsParameterRaise(GlobalParameter.VENUS)) {
        marsBot.game.increaseVenusScaleLevel(marsBot.player, 1);
      }
      const venusTrack = marsBot.marsBotBoard.tagToTrack[Tag.VENUS];
      if (venusTrack !== undefined) {
        marsBot.maybeAdvanceTrack(venusTrack);
      }
      marsBot.game.log('MarsBot (${0}): raises Venus and advances the Venus track', (b) => b.cardName(this.name));
      marsBot.advanceFurthestParameter(this.name);
    } else {
      marsBot.maybeAdvanceTrack(marsBot.marsBotBoard.getLeastAdvancedTrackIndex());
      marsBot.game.log('MarsBot (${0}): advances the least-advanced track', (b) => b.cardName(this.name));
    }
    return false;
  }
}
