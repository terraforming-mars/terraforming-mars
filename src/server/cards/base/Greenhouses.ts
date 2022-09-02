import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class Greenhouses extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GREENHOUSES,
      tags: [Tag.PLANT, Tag.BUILDING],
      cost: 6,

      metadata: {
        cardNumber: '096',
        renderData: CardRenderer.builder((b) => {
          b.plants(1).slash().city({size: Size.SMALL, all});
        }),
        description: 'Gain 1 plant for each city tile in play.',
      },
    });
  }
  public play(player: Player) {
    player.addResource(Resources.PLANTS, player.game.getCitiesCount(), {log: true});
    return undefined;
  }
}
