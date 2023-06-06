import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';

export class CosmicRays extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.COSMIC_RAYS,
      type: CardType.AUTOMATED,
      tags: [Tag.RADIATION, Tag.SPACE],
      cost: 11,

      behavior: {
        addResourcesToAnyCard: {count: {tag: Tag.RADIATION, per: 2}},
        production: {heat: -1, titanium: 1}
      },

      metadata: {
        description: 'Decrease your heat production 1 step. Incease your titanium production 1 step. Add 1 radiation to another card per 2 radiation tags you have, including this.',
        cardNumber: 'N12',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().heat(1).plus().titanium(1)).br;
          b.radiations(1).asterix().slash().radiation({amount: 2, played}).radiation();
        }),
      },
    });
  }
}
