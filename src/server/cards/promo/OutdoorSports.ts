import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {all, nextTo} from '@/server/cards/Options';
import {Board} from '@/server/boards/Board';

export class OutdoorSports extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.OUTDOOR_SPORTS,
      cost: 8,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: 2},
      },

      requirements: [{cities: 1, all, nextTo}, {oceans: 1}],
      metadata: {
        cardNumber: 'X38',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(2);
          });
        }),
        description: 'Requires any city adjacent to an ocean. Increase your M€ production 2 steps.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    const board = player.game.board;
    const oceans = board.getOceanSpaces({upgradedOceans: true, wetlands: true});
    return oceans.some((ocean) => board.getAdjacentSpaces(ocean).some((space) => Board.isCitySpace(space)));
  }
}
