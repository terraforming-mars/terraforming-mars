import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ImportOfAdvancedGHG extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORT_OF_ADVANCED_GHG,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 9,

      metadata: {
        cardNumber: '167',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.heat(2))),
        description: 'Increase your heat production 2 steps.',
      },
    });
  }

  public play(player: Player) {
    player.production.add(Resources.HEAT, 2);
    return undefined;
  }
}
