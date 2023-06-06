import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../requirements/CardRequirements';
import { played } from '../Options';


export class PlanetXSighting extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.PLANET_X_SIGHTING,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 11,

      requirements: CardRequirements.builder((b) => b.tag(Tag.RADIATION, 3)),

      behavior: {
        production: {energy: {tag: Tag.JOVIAN, per: 3/2}},
        stock: {heat: {tag: Tag.SPACE, per: 2}},
        addResourcesToAnyCard: {count: 2, type: CardResource.RADIATION},
      },

      metadata: {
        description: 'Requires 3 radiation tags. Increase your energy production 2 steps for every 3 Jovian tags you have. Gain 1 heat for every 2 space tags you have. Add 2 radiation to another card. ',
        cardNumber: 'N66',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.energy(2).slash().jovian({amount:3, played});
          }).br;
          b.heat(1).slash().space({amount:2, played}).br;
          b.radiations(2).asterix();
        }),
      },
    });
  }

}
