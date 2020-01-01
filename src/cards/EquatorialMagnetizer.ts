
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import { Resources } from '../Resources';

export class EquatorialMagnetizer implements IActionCard, IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = 'Equatorial Magnetizer';
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
      return true;
    }
    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.getProduction(Resources.ENERGY) >= 1;
    }
    public action(player: Player) {
      player.setProduction(Resources.ENERGY,-1);
      player.terraformRating++;
      return undefined;
    }
}

