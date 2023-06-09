import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class EmmetVille extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.EMMET_VILLE,
      tags: [Tag.MARS, Tag.MARS],
      cost: 22,
      victoryPoints: {tag: Tag.MARS},

      metadata: {
        cardNumber: 'PF60',
        description: 'Couldve been Mosesville...',
        renderData: CardRenderer.builder((b) => {
          b.vpText('1 VP per Mars tag you have.');
        }),
      },
    });
  }
}
