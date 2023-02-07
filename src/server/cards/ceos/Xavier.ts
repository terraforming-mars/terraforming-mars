import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {played} from '../Options';

export class Xavier extends Card implements CeoCard {
  constructor() {
    super({
      name: CardName.XAVIER,
      cardType: CardType.CEO,
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

  public isDisabled = false;
  public opgActionIsActive = false;

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(): PlayerInput | undefined {
    this.opgActionIsActive = true;
    this.isDisabled = true;
    return undefined;
  }
}
