import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Plantation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PLANTATION,
      tags: [Tags.PLANT],
      cost: 15,
      tr: {oxygen: 1},

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      metadata: {
        cardNumber: '193',
        renderData: CardRenderer.builder((b) => {
          b.greenery();
        }),
        description: 'Requires 2 Science tags. Place a greenery tile and raise oxygen 1 step.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    if (player.game.board.getAvailableSpacesOnLand(player).length === 0) {
      return false;
    }
    return true;
  }

  public play(player: Player) {
    return new SelectSpace('Select space for greenery tile', player.game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
      return player.game.addGreenery(player, space.id);
    });
  }
}
