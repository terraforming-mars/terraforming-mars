
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

export class BeamFromAThoriumAsteroid implements IProjectCard {
    public cost: number = 32;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE, Tags.ENERGY];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = 'Beam From A Thorium Asteroid';
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.JOVIAN) >= 1;
    }
    public play(player: Player) {
      player.heatProduction += 3;
      player.energyProduction += 3;
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}

