import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';
import {CardResource} from '../../../common/CardResource';
import {IActionCard} from '../ICard';

export class LunaArchives extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.LUNA_ARCHIVES,
      type: CardType.ACTIVE,
      tags: [Tag.SCIENCE, Tag.MOON],
      cost: 13,
      resourceType: CardResource.SCIENCE,

      action: {
        addResources: {tag: Tag.MOON},
      },

      metadata: {
        cardNumber: 'M69',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 science resource here for each Moon tag you have.',
            (ab) => ab.empty().startAction.resource(CardResource.SCIENCE).slash().tag(Tag.MOON));
          b.br;
          b.effect('When playing a Moon tag, science resources here may be used as payment, and are worth 1M€ each.',
            (eb) => eb.tag(Tag.MOON).startEffect.resource(CardResource.SCIENCE).equals().megacredits(1));
        }),
      },
    });
  }
}
