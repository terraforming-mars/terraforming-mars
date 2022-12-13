import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {LeaderCard} from "./LeaderCard";
import {Player} from "../../Player";
import {VictoryPointsBreakdown} from "../../VictoryPointsBreakdown";

export class LeadersExpansion {
  public static calculateVictoryPoints(player: Player, vpb: VictoryPointsBreakdown): void {
    if (player.cardIsInEffect(CardName.DUNCAN)) {
      const card = player.playedCards.find((c) => c.name === CardName.DUNCAN) as LeaderCard;
      if (card.isDisabled === true && card.generationUsed !== undefined) {
        vpb.setVictoryPoints('victoryPoints', 6 - card.generationUsed, 'Leaders VP');
      }
    }
  }

  public static getBonusWildTags(player: Player) {
    const xavier = player.playedCards.find((card) => card.name === CardName.XAVIER);
    if (xavier !== undefined && (xavier as LeaderCard).opgActionIsActive === true) {
      return 2;
    }
    return 0;
  }

  public static leaderActionIsUsable(player: Player): boolean {
    if (player.game.gameOptions.leaderExtension === false) return false;
    const leader = player.playedCards.find((card) => card.cardType === CardType.LEADER) as LeaderCard;
    if (leader === undefined) return false;
    if (leader.canAct === undefined) return false;

    return leader.canAct(player);
  }
}
