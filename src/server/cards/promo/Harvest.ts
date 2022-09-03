import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {CardRequirements} from '../CardRequirements';

export class Harvest extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.HARVEST,
      tags: [Tag.PLANT],
      cost: 4,
      requirements: CardRequirements.builder((b) => b.greeneries(3)),
      metadata: {
        cardNumber: 'X37',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(12);
        }),
        description: 'Requires that you have 3 greenery tiles in play. Gain 12 M€.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.addResource(Resources.MEGACREDITS, 12, {log: true});
    return undefined;
  }
}
