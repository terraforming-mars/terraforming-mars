import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IMarsBot} from '@/server/automa/IMarsBot';
export class Philantropist extends BaseMilestone {
  public readonly automaDescription = '5+ cards with non-negative VP';
  constructor() {
    super(
      'Philantropist',
      'Have 5 cards with non-negative VP',
      5,
    );
  }

  public getScore(player: IPlayer): number {
    const cardsWithVP = player.tableau.filter((card) => {
      const victoryPoints = card.metadata.victoryPoints;

      if (card.type === CardType.EVENT) {
        return false;
      }
      if (victoryPoints === undefined) {
        return false;
      }

      if (typeof victoryPoints === 'number') {
        return victoryPoints > 0;
      } else {
        return victoryPoints.points > 0;
      }
    });

    return cardsWithVP.length;
  }

  /** MarsBot needs 5 such cards in its own played pile (rulebook C p.13). */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.playedProjectCards.filter((card) => {
      const victoryPoints = card.metadata.victoryPoints;
      if (card.type === CardType.EVENT || victoryPoints === undefined) {
        return false;
      }
      return typeof victoryPoints === 'number' ? victoryPoints > 0 : victoryPoints.points > 0;
    }).length >= 5;
  }
}
