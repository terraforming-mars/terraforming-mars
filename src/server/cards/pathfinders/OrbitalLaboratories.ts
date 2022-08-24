import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {Tag} from '../../../common/cards/Tag';

export class OrbitalLaboratories extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ORBITAL_LABORATORIES,
      cost: 18,
      tags: [Tag.SCIENCE, Tag.PLANT, Tag.SPACE],

      metadata: {
        cardNumber: 'Pf07',
        renderData: CardRenderer.builder((b) => {
          b.plants(1).nbsp.production(((pb) => pb.plants(2)));
        }),
        description: 'Increase your plant production by 2. Gain 1 plant.',
      },
    });
  }


  public play(player: Player) {
    player.addResource(Resources.PLANTS, 1);
    player.production.add(Resources.PLANTS, 2);
    return undefined;
  }
}

