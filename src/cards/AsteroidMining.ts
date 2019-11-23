import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

export class AsteroidMining implements IProjectCard {
    public cost: number = 30;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = 'Asteroid Mining';
    public text: string =
      'Increase your titanium production 2 steps. Gain 2 victory points.';
    public requirements: undefined;
    public description: string =
      'Where gravity is low and rare minerals abound.';
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player) {
      player.titaniumProduction += 2;
      player.victoryPoints += 2;
      return undefined;
    }
}
