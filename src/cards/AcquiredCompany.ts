import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { Resources } from '../Resources';

export class AcquiredCompany implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = 'Acquired Company';
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player) {
      player.setProduction(Resources.MEGACREDITS,3);
      return undefined;
    }
}
