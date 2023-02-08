import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {digit} from '../Options';
import {Units} from '../../../common/Units';

export class HAL9000 extends CeoCard {
  constructor() {
    super({
      name: CardName.HAL9000,
      metadata: {
        cardNumber: 'L08',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.minus().text('EACH').production((pb) => pb.wild(1)).nbsp.colon().wild(4, {digit}).asterix();
          b.br;
        }),
        description: 'Once per game, decrease each of your productions 1 step to gain 4 of that resource.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    // For every Unit type, see if we can adjust production of that resource by -1
    // If we can, make said adjustment, and give the player 4 of that production resource
    for (const type of Units.keys) {
      const adjustment = Units.of({});
      adjustment[type] = -1;
      if (player.production.canAdjust(adjustment)) {
        player.production.adjust(adjustment, {log: true});
        adjustment[type] = 4;
        player.addUnits(adjustment, {log: true});
      }
    }

    this.isDisabled = true;
    return undefined;
  }
}


