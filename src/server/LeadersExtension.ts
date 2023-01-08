import {Player} from './Player';
import {isLeaderCard} from './cards/leaders/LeaderCard';
// import {CardName} from '../common/cards/CardName';
// import {VictoryPointsBreakdown} from './VictoryPointsBreakdown';

export class LeadersExtension {
  // public static calculateVictoryPoints(player: Player, vpb: VictoryPointsBreakdown): void {
  //   const duncan = player.getLeader(CardName.DUNCAN);
  //   if (duncan?.isDisabled === true && duncan.generationUsed !== undefined) {
  //     vpb.setVictoryPoints('victoryPoints', 6 - duncan.generationUsed, 'Leaders VP');
  //   }
  // }

  // public static getBonusWildTags(player: Player) {
  //   const xavier = player.getLeader(CardName.XAVIER);
  //   if (xavier?.opgActionIsActive === true) {
  //     return 2;
  //   }
  //   return 0;
  // }

  public static leaderActionIsUsable(player: Player): boolean {
    for (const card of player.playedCards) {
      if (isLeaderCard(card)) {
        return card.canAct?.(player);
      }
    }
    return false;
  }
}
