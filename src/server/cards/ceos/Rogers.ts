import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {GlobalParameter} from '../../../common/GlobalParameter';

export class Rogers extends CeoCard {
  constructor() {
    super({
      name: CardName.ROGERS,
      metadata: {
        cardNumber: 'L18',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br;
          b.tag(Tag.VENUS).colon().projectRequirements();
          b.br;
          b.tag(Tag.VENUS).colon().megacredits(-3);
        }),
        description: 'Ignore global requirements for your Venus cards THIS GENERATION. When you play a Venus tag THIS GENERATION, you pay 3 M€ less for it.',
      },
    });
  }

  public opgActionIsActive = false;

  public action(): PlayerInput | undefined {
    this.isDisabled = true;
    this.opgActionIsActive = true;
    return undefined;
  }

  public override getGlobalParameterRequirementBonus(_player: IPlayer, parameter: GlobalParameter): number {
    if (this.opgActionIsActive === false || parameter !== GlobalParameter.VENUS) return 0;
    // Magic number high enough to always ignore requirements.
    return 50;
  }

  public override getCardDiscount(_player: IPlayer, card: IProjectCard) {
    if (this.opgActionIsActive === false) return 0;
    return card.tags.filter((tag) => tag === Tag.VENUS).length * 3;
  }
}
