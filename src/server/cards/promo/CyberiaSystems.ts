import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {RoboticWorkforceBase} from '../base/RoboticWorkforceBase';

export class CyberiaSystems extends RoboticWorkforceBase {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CYBERIA_SYSTEMS,
      tags: [Tag.BUILDING],
      cost: 17,

      behavior: {production: {steel: 1}},

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(1)).br;
          b.text('COPY THE PRODUCTION BOXES OF 2 OF YOUR OTHER CARDS WITH BUILDING TAGS.');
        }),
        description: 'Raise your steel production 1 step.',
      },
    });
  }

  public override selectCardText(): string {
    return 'Select 2 builder cards to copy';
  }

  public override count(): number {
    return 2;
  }
}
