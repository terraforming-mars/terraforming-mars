import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {all} from '../Options';

export class VanAllen extends CeoCard {
  constructor() {
    super({
      name: CardName.VANALLEN,
      metadata: {
        cardNumber: 'L22',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.text('MILESTONES: ').megacredits(0, {cancelled: true}).megacredits(3, {all}).asterix();
          b.br.br;
        }),
        description: 'You may claim milestones for free (you must still meet the requirements). When any milestone is claimed, gain 3 M€.',
      },
    });
  }

  // All of the Van Allen hook is done in src/server/Player.ts : claimMilestone()

  public override canAct(): boolean {
    return false;
  }
}
