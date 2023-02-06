import {Player} from './Player';
import {isCeoCard} from './cards/ceos/CeoCard';
import {CardName} from '../common/cards/CardName';
import {VictoryPointsBreakdown} from './VictoryPointsBreakdown';

export class CeoExtension {
  public static calculateVictoryPoints(player: Player, vpb: VictoryPointsBreakdown): void {
    const duncan = player.getCeo(CardName.DUNCAN);
    if (duncan?.isDisabled === true && duncan.generationUsed !== undefined) {
      vpb.setVictoryPoints('victoryPoints', 6 - duncan.generationUsed, 'CEO VP');
    }
  }

  // public static getBonusWildTags(player: Player) {
  //   const xavier = player.getCeo(CardName.XAVIER);
  //   if (xavier?.opgActionIsActive === true) {
  //     return 2;
  //   }
  //   return 0;
  // }

  public static ceoActionIsUsable(player: Player): boolean {
    for (const card of player.playedCards) {
      if (isCeoCard(card)) {
        return card.canAct?.(player);
      }
    }
    return false;
  }
}
