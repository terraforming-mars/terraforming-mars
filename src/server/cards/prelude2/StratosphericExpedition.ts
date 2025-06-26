import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';

export class StratosphericExpedition extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.STRATOSPHERIC_EXPEDITION,
      cost: 12,
      tags: [Tag.VENUS, Tag.SPACE],
      type: CardType.EVENT,
      victoryPoints: 1,

      behavior: {
        addResourcesToAnyCard: {count: 2, type: CardResource.FLOATER},
        drawCard: {count: 2, tag: Tag.VENUS},
      },
      metadata: {
        cardNumber: 'P84',
        renderData: CardRenderer.builder((b) => {
          b.resource(CardResource.FLOATER, 2).asterix().cards(2, {secondaryTag: Tag.VENUS});
        }),
        description: 'Add two floaters to ANY CARD. Draw 2 Venus cards.',
      },
    });
  }
}
