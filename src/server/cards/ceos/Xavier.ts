import {CardName} from '../../../common/cards/CardName';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {played} from '../Options';

export class Xavier extends CeoCard {
  constructor() {
    super({
      name: CardName.XAVIER,
      metadata: {
        cardNumber: 'L24',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.text('GAIN').nbsp.wild(2, {played});
          b.br.br;
        }),
        description: 'Gain 2 wild tags for THIS GENERATION.',
      },
    });
  }

  public opgActionIsActive = false;

  public action(): PlayerInput | undefined {
    this.isDisabled = true;
    this.opgActionIsActive = true;
    return undefined;
  }
}
