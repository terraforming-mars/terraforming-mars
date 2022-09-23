import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class Gyropolis extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.GYROPOLIS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 20,

      behavior: {
        city: {},
        production: {energy: -2, megacredits: {tag: [Tag.VENUS, Tag.EARTH]}},
      },

      metadata: {
        cardNumber: '230',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).br;
            pb.plus().megacredits(1).slash().venus(1, {played}).br;
            pb.plus().megacredits(1).slash().earth(1, {played}).br;
          }).nbsp.city();
        }),
        description: 'Decrease your energy production 2 steps. Increase your M€ production 1 step for each Venus and Earth tag you have. Place a City tile.',
      },
    });
  }
}
