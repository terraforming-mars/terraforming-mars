import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';

export class OrbitalCleanup extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ORBITAL_CLEANUP,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 14,
      victoryPoints: 2,

      behavior: {
        production: {megacredits: -2},
      },

      action: {
        stock: {megacredits: {tag: Tag.SCIENCE}},
      },

      metadata: {
        cardNumber: 'X08',

        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 M€ per science tag you have.', (eb) => {
            eb.empty().startAction.megacredits(1).slash().tag(Tag.SCIENCE);
          }).br;
          b.production((pb) => {
            pb.megacredits(-2);
          });
        }),
        description: 'Decrease your M€ production 2 steps.',
      },
    });
  }
}
