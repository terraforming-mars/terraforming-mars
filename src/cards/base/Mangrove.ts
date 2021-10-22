import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class Mangrove extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MANGROVE,
      tags: [Tags.PLANT],
      cost: 12,
      tr: {oxygen: 1},
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.temperature(4)),
      metadata: {
        cardNumber: '059',
        renderData: CardRenderer.builder((b) => b.greenery(Size.MEDIUM).asterix()),
        description: 'Requires +4 C or warmer. Place a greenery tile ON AN AREA RESERVED FOR OCEAN and raise oxygen 1 step. Disregard normal placement restrictions for this.',
      },
    });
  }

  public play(player: Player) {
    return new SelectSpace('Select ocean space for greenery tile', player.game.board.getAvailableSpacesForOcean(player), (foundSpace: ISpace) => {
      return player.game.addGreenery(player, foundSpace.id, SpaceType.OCEAN);
    });
  }
}
