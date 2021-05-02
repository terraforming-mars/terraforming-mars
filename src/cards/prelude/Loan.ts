import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Loan extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.LOAN,

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
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -3;
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -2);
    player.megaCredits += 30;
    return undefined;
  }
}

