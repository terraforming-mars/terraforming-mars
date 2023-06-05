import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {all} from '../Options';
import {Board} from '../../boards/Board';

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

      requirements: CardRequirements.builder((b) => b.cities(1, {all, text: ' next to'}).oceans(1)),
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

  public override bespokeCanPlay(player: Player) {
    const board = player.game.board;
    const oceans = board.getOceanSpaces({upgradedOceans: true, wetlands: true} );
    return oceans.some((ocean) => board.getAdjacentSpaces(ocean).some((space) => Board.isCitySpace(space)));
  }
}
