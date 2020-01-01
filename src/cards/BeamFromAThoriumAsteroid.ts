
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { Resources } from "../Resources";

export class BeamFromAThoriumAsteroid implements IProjectCard {
    public cost: number = 32;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE, Tags.ENERGY];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = 'Beam From A Thorium Asteroid';
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.JOVIAN) >= 1;
    }
    public play(player: Player) {
      player.setProduction(Resources.HEAT,3);
      player.setProduction(Resources.ENERGY,3);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}

