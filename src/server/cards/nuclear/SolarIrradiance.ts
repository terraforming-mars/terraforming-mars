import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
//import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
//import {GainProduction} from '../../deferredActions/GainProduction';
import { CardResource } from '../../../common/CardResource';

export class SolarIrradiance extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SOLAR_IRRADIANCE,
      tags: [Tag.SPACE],
      cost: 7,

      behavior: {
        production: {heat: -1},
        stock: {megacredits: 1, steel: 1, titanium: 1, plants: 1, energy: 1, heat: 1},
        addResourcesToAnyCard: [
          {count: 1, type: CardResource.RADIATION},
        ],
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.EARTH, 2)),
      metadata: {
        cardNumber: 'N13',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().heat(1);
          }).br;
          b.megacredits(1).steel(1).titanium(1).br;
          b.plants(1).energy(1).heat(1).br;
          b.radiations(1).asterix();
        }),
        description: 'Requires 2 Earth tags. Decrease your M€ production 1 step and any plant production 1 step and increase your own 2 steps.',
      },
    });
  }

}
