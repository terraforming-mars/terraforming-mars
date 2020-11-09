import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class Loan extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.LOAN;

    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.MEGACREDITS) >= -3;
    }
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, -2);
      player.megaCredits += 30;
      return undefined;
    }
}

