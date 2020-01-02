import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { Resources } from '../Resources';

export class AsteroidMining implements IProjectCard {
    public cost: number = 30;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = 'Asteroid Mining';
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player) {
      player.setProduction(Resources.TITANIUM,2);
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
}
