import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {max} from '../Options';

export class EarlyExpedition extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.EARLY_EXPEDITION,
      cost: 15,
      tags: [Tag.SCIENCE, Tag.SPACE, Tag.CITY],
      requirements: {temperature: -18, max},

      behavior: {
        production: {energy: -1, megacredits: 3},
        addResourcesToAnyCard: {type: CardResource.DATA, count: 1},
        city: {on: 'isolated'},
      },

      metadata: {
        cardNumber: 'Pf18',
        renderData: CardRenderer.builder((b) => {
          b.minus().production((pb) => pb.energy(1)).production((pb) => pb.megacredits(3)).br;
          b.resource(CardResource.DATA).asterix().city().asterix();
        }),
        description: 'Temperature must be -18 C or lower. Decrease your energy production 1 step and ' +
          'Raise your M€ production 3 steps. Add 1 data to ANY card. Place a city tile on Mars NEXT TO NO OTHER TILE.',
      },
    });
  }
}
