import {CardName} from '../../../common/cards/CardName';
import {all} from '../Options';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

export class VanAllen extends CeoCard {
  constructor() {
    super({
      name: CardName.VANALLEN,
      metadata: {
        cardNumber: 'L22',
        renderData: CardRenderer.builder((b) => {
          b.effect('MILESTONES ALWAYS COST 0 M€ FOR YOU.', (eb) => {
            eb.plate('Milestones').startEffect.megacredits(1, {text: '0'});
          });
          b.br;
          b.effect('When any milestone is claimed, gain 3 M€.', (eb) => eb.milestone({all}).startEffect.megacredits(3));
        }),
      },
    });
  }

  // All of the Van Allen hook is done in src/server/Player.ts : claimMilestone()

  public override canAct(): boolean {
    return false;
  }
}
