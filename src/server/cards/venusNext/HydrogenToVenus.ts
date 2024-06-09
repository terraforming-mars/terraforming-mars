import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class HydrogenToVenus extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.HYDROGEN_TO_VENUS,
      type: CardType.EVENT,
      tags: [Tag.SPACE],
      cost: 11,

      behavior: {
        global: {venus: 1},
        addResourcesToAnyCard: {count: {tag: Tag.JOVIAN}, type: CardResource.FLOATER, tag: Tag.VENUS},
      },

      metadata: {
        cardNumber: '231',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br.br; // double br is intentional for visual appeal
          b.resource(CardResource.FLOATER, {secondaryTag: Tag.VENUS}).slash().tag(Tag.JOVIAN);
        }),
        description: 'Raise Venus 1 step. Add 1 floater to A VENUS CARD for each Jovian tag you have.',
      },
    });
  }
}
