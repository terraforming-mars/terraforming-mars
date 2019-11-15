import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

export class AcquiredCompany implements IProjectCard {
    public cost: number = 10;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = 'Acquired Company';
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = 'Increase your mega credit production 3 steps';
    public requirements: undefined;
    public description: string = 'This interplanetary company will ' +
      'surely pay off';
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player) {
      player.megaCreditProduction += 3;
      return undefined;
    }
}
