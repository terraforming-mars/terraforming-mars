import {GlobalParameter} from '@/common/GlobalParameter';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {advanceFurthestParameter, maybeAdvanceTrack} from '@/server/automa/bonusCards/bonusCardHelpers';

export class VenusianLobbyMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B26_VENUSIAN_LOBBY});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    if (marsBot.game.gameOptions.venusNextExtension) {
      // Morningstar: raise Venus 1 step and advance the Venus track, then raise the global parameter
      // furthest from its maximum
      if (marsBot.game.getVenusScaleLevel() < marsBot.game.max.venus && !marsBot.interceptsParameterRaise(GlobalParameter.VENUS)) {
        marsBot.game.increaseVenusScaleLevel(marsBot.player, 1);
      }
      const venusTrack = marsBot.marsBotBoard.tagToTrack[Tag.VENUS];
      if (venusTrack !== undefined) {
        maybeAdvanceTrack(marsBot, venusTrack);
      }
      marsBot.game.log('MarsBot (${0}): raises Venus and advances the Venus track', (b) => b.cardName(name));
      advanceFurthestParameter(marsBot, name);
    } else {
      maybeAdvanceTrack(marsBot, marsBot.marsBotBoard.getLeastAdvancedTrackIndex());
      marsBot.game.log('MarsBot (${0}): advances the least-advanced track', (b) => b.cardName(name));
    }
    return false;
  }
}
