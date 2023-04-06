import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ImmigrationShuttles extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.IMMIGRATION_SHUTTLES,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 31,
      victoryPoints: {cities: {}, all: true, per: 3},

      behavior: {
        production: {megacredits: 5},
      },

      metadata: {
        cardNumber: '198',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(5)).br;
          b.vpText('1 VP for every 3rd City in play.');
        }),
        description: 'Increase your M€ production 5 steps.',
      },
    });
  }
}
