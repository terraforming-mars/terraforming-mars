import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import { CardResource } from '../../../common/CardResource';

export class SoilDecontamination extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SOIL_DECONTAMINATION,
      tags: [Tag.EARTH, Tag.MICROBE, Tag.PLANT],
      cost: 21,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: -1, plants: 2},
        decreaseAnyProduction: {type: Resource.PLANTS, count: 1},
        stock: {plants: 2},
        addResourcesToAnyCard: [
          {count: 1, type: CardResource.MICROBE},
          {count: 2, type: CardResource.RADIATION},
        ],
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.EARTH, 2)),
      metadata: {
        cardNumber: 'N13',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(1).plants(1, {all}).br;
            pb.plus().plants(2);
          }).br;
          b.microbes(1).asterix().nbsp.radiations(2).asterix();
        }),
        description: 
        {text:'Requires 2 Earth tags. Decrease your M€ production 1 step and any plant production 1 step and increase your own 2 steps. Gain 2 plants. Add 1 microbe to ANOTHER card. Add 2 radiation to ANOTHER card.',
        align: 'left'}
      },
    });
  }

}
