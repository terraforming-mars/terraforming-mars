import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class MedicalLab extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MEDICAL_LAB,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 13,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: {tag: Tag.BUILDING, per: 2}},
      },

      metadata: {
        cardNumber: '207',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().building(2, {played});
          });
        }),
        description: 'Increase your M€ production 1 step for every 2 Building tags you have, including this.',
      },
    });
  }
}
