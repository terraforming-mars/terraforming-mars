import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
export class Philantropist extends BaseMilestone {
  constructor() {
    super(
      'Philantropist',
      'Have at least 5 cards with VPs among your cards',
      5,
    );
  }

  public getScore(player: IPlayer): number {
    const cardsWithVP = player.tableau.filter((card) => {
      const victoryPoints = card.metadata.victoryPoints;

      if (card.type === CardType.EVENT) return false;
      if (victoryPoints === undefined) return false;

      if (typeof victoryPoints === 'number') {
        return victoryPoints > 0;
      } else {
        return victoryPoints.points > 0;
      }
    });

    return cardsWithVP.length;
  }
}
