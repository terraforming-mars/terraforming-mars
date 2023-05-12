import {CardName} from '../../../common/cards/CardName';
import {all, digit} from '../Options';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

export class VanAllen extends CeoCard {
  constructor() {
    super({
      name: CardName.VANALLEN,
      metadata: {
        cardNumber: 'L22',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.milestone().colon().text('=').megacredits(0, {digit});
          b.br;
          b.milestone({all}).colon().megacredits(3);
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
