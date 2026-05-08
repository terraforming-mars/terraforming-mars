import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {Board} from '../../boards/Board';
import {Resource} from '../../../common/Resource';
import {GainResourcesDeferred} from '../../deferredActions/GainResourcesDeferred';

export class Pipes extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.PIPES,
      cost: 6,

      metadata: {
        cardNumber: 'B22',
        description: 'Get 1 M€ for each tile you own adjacent to at least one Ocean.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().text('tile adj ocean');
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const board = player.game.board;
    let count = 0;
    for (const space of board.spaces) {
      if (space.player === player && space.tile !== undefined) {
        const adjacentSpaces = board.getAdjacentSpaces(space);
        if (adjacentSpaces.some((adj) => Board.isOceanSpace(adj))) {
          count++;
        }
      }
    }
    if (count > 0) {
      player.game.defer(new GainResourcesDeferred(player, Resource.MEGACREDITS, {count, log: true}));
    }
    return undefined;
  }
}
