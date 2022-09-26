import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class UndermoonDrugLordsNetwork extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.UNDERMOON_DRUG_LORDS_NETWORK,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON],
      cost: 2,
      victoryPoints: -1,

      behavior: {
        production: {megacredits: {moon: {habitatRate: {}}, per: 2}},
      },

      metadata: {
        description: 'Increase your M€ production 1 step per 2 steps of Habitat Rate.',
        cardNumber: 'M81',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1);
          }).slash().moonHabitatRate({amount: 2});
        }),
      },
    });
  }
}
