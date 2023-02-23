import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Resources} from '../../../common/Resources';

export class Greta extends CeoCard {
  constructor() {
    super({
      name: CardName.GRETA,
      metadata: {
        cardNumber: 'L31',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.tr(1).colon().megacredits(4);
          b.br;
        }),
        description: 'When you take an action or gain a track bonus that raises your terraform rating THIS GENERATION, gain 4 M€.',
      },
    });
  }

  public opgActionIsActive = false;

  public action(): PlayerInput | undefined {
    this.opgActionIsActive = true;
    this.isDisabled = true;
    return undefined;
  }

  public onTRIncrease(player: Player): undefined {
    if (this.opgActionIsActive === true) {
      player.addResource(Resources.MEGACREDITS, 4, {log: true});
    }
    return undefined;
  }
}
