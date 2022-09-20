
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Cartel extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CARTEL,
      tags: [Tag.EARTH],
      cost: 8,

      behavior: {
        production: {megacredits: {tag: Tag.EARTH}},
      },

      metadata: {
        cardNumber: '137',
        description: 'Increase your M€ production 1 step for each Earth tag you have, including this.',
        renderData: CardRenderer.builder((b) => b.production((pb) => {
          pb.megacredits(1).slash().earth(1, {played});
        })),
      },
    });
  }
}
