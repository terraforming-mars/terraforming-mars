import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Loan extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.LOAN,
      startingMegacredits: 30,

      behavior: {
        production: {megacredits: -2},
      },

      metadata: {
        cardNumber: 'P17',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().megacredits(2)).br;
          b.megacredits(30);
        }),
        description: 'Gain 30 M€. Decrease your M€ production 2 steps.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.megaCredits += 30;
    return undefined;
  }
}

