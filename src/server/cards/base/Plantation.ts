import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceGreeneryTile} from '../../deferredActions/PlaceGreeneryTile';

export class Plantation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PLANTATION,
      tags: [Tag.PLANT],
      cost: 15,
      tr: {oxygen: 1},

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 2)),
      metadata: {
        cardNumber: '193',
        renderData: CardRenderer.builder((b) => {
          b.greenery();
        }),
        description: 'Requires 2 science tags. Place a greenery tile and raise oxygen 1 step.',
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesForGreenery(player).length > 0;
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceGreeneryTile(player));
    return undefined;
  }
}
