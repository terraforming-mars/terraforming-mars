import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';

export class BaseOnTitan extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.BASE_ON_TITAN,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 25,
      victoryPoints: {tag: Tag.JOVIAN},
      requirements: {tag: Tag.JOVIAN, count: 3},
      action: {
        spend: {titanium: 2},
        tr: 1,
      },
      metadata: {
        cardNumber: 'B49',
        description: 'Requires you own 3 Jovian tags. 1 VP for each Jovian tag you own.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 Titanium to raise your TR 1 step.', (ab) => {
            ab.titanium(2).startAction.tr(1);
          }).br;
          b.vpText('1 VP per Jovian tag you own.');
        }),
      },
    });
  }
}
