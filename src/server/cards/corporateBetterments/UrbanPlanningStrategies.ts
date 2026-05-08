import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Board} from '../../boards/Board';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class UrbanPlanningStrategies extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.URBAN_PLANNING_STRATEGIES,
      cost: 15,
      metadata: {
        cardNumber: 'B42',
        description: 'Increase your TR 2 steps for every City you own adjacent to at least 1 Ocean and 2 Greeneries. Other players increase their TR 1 step for each such City.',
        renderData: CardRenderer.builder((b) => {
          b.tr(2).slash().city({size: Size.SMALL}).asterix().br;
          b.tr(1).slash().city({size: Size.SMALL, all}).asterix();
        }),
      },
    });
  }

  private countQualifyingCities(game: IPlayer['game'], target: IPlayer): number {
    const board = game.board;
    let count = 0;
    for (const space of board.spaces) {
      if (space.player === target && Board.isCitySpace(space)) {
        const adj = board.getAdjacentSpaces(space);
        const hasOcean = adj.some((s) => Board.isOceanSpace(s));
        const greeneries = adj.filter((s) => Board.isGreenerySpace(s)).length;
        if (hasOcean && greeneries >= 2) count++;
      }
    }
    return count;
  }

  public override play(player: IPlayer) {
    player.increaseTerraformRating(this.countQualifyingCities(player.game, player) * 2);
    for (const other of player.game.players) {
      if (other !== player) other.increaseTerraformRating(this.countQualifyingCities(player.game, other));
    }
    return undefined;
  }
}
